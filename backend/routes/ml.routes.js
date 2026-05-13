import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// POST /api/ml/predict — Send data to Python ML service
router.post('/predict', protect, upload.array('files', 10), async (req, res, next) => {
  try {
    const { testId, inputType, answers } = req.body;

    // Build payload for Python ML service
    const payload = {
      testId,
      inputType,
      answers: answers ? JSON.parse(answers) : {},
      files: req.files ? req.files.map(f => f.path) : [],
    };

    // Call Python Flask ML service
    const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json().catch(() => ({}));
      return res.status(mlResponse.status).json({
        error: errorData.error || 'ML service returned an error',
        fallback: true,
      });
    }

    const result = await mlResponse.json();

    res.json({
      success: true,
      prediction: result.prediction,
      confidence: result.confidence,
      riskLevel: result.risk_level,
      details: result.details || {},
      modelVersion: result.model_version || 'v1.0',
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    // If ML service is unreachable, return a fallback mock result
    if (error.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNREFUSED') {
      console.warn('⚠️  ML Service unavailable — returning mock prediction');
      const score = Math.floor(Math.random() * 40) + 30;
      return res.json({
        success: true,
        prediction: 'Moderate Risk Detected',
        confidence: score,
        riskLevel: score > 60 ? 'High' : score > 40 ? 'Moderate' : 'Low',
        details: { note: 'ML service offline — this is a simulated result' },
        modelVersion: 'mock-v1.0',
        processedAt: new Date().toISOString(),
        fallback: true,
      });
    }
    next(error);
  }
});

// GET /api/ml/health — Check ML service status
router.get('/health', async (req, res) => {
  try {
    const mlResponse = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await mlResponse.json();
    res.json({ success: true, mlService: 'online', ...data });
  } catch {
    res.json({ success: true, mlService: 'offline', message: 'Python ML service is not running' });
  }
});

// GET /api/ml/models — List available ML models
router.get('/models', async (req, res) => {
  try {
    const mlResponse = await fetch(`${ML_SERVICE_URL}/models`);
    const data = await mlResponse.json();
    res.json({ success: true, ...data });
  } catch {
    res.json({ success: true, models: [], message: 'ML service offline' });
  }
});

export default router;
