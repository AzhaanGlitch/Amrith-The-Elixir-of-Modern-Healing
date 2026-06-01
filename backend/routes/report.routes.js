import express from 'express';
import Report from '../models/Report.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { compileReportHtml } from '../utils/reportGenerator.js';

const router = express.Router();

router.use(protect);

// ─── GET /api/reports ────────────────────────────────────────
// Get reports (role-filtered)
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('patient', 'name email avatar')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'testName scheduledDate status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      count: reports.length,
      total,
      reports,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/reports/download-triage ───────────────────────
// Stateless triage download (before booking, from results page)
router.post('/download-triage', async (req, res, next) => {
  try {
    const { prediction, confidence, riskLevel, details, modelVersion, testName } = req.body;

    const html = compileReportHtml({
      patient: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        age: req.user.age,
        gender: req.user.gender,
        bloodGroup: req.user.bloodGroup,
      },
      doctor: null,
      appointment: null,
      triage: {
        prediction,
        confidence,
        riskLevel,
        details,
        modelVersion,
        processedAt: new Date(),
      },
      isTemp: true,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="amrith-triage-report-${Date.now()}.html"`);
    res.send(html);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/reports/:id ────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient', 'name email phone avatar age gender bloodGroup')
      .populate('doctor', 'name email specialization qualification')
      .populate('appointment');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/reports/:id/download ───────────────────────────
// Download a saved report as HTML
router.get('/:id/download', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name email specialization qualification')
      .populate('appointment');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const html = compileReportHtml({
      patient: report.patient || {},
      doctor: report.doctor || null,
      appointment: report.appointment || null,
      triage: {
        _id: report._id,
        prediction: report.aiAnalysis?.prediction || report.testName,
        confidence: report.aiAnalysis?.confidence || 0,
        riskLevel: report.aiAnalysis?.riskLevel || 'Low',
        details: report.aiAnalysis?.details || {},
        modelVersion: report.aiAnalysis?.modelVersion || 'v1.0',
        processedAt: report.aiAnalysis?.processedAt || report.createdAt,
      },
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="amrith-report-${report._id}.html"`);
    res.send(html);
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /api/reports/:id/review ───────────────────────────
// Doctor reviews a report
router.patch('/:id/review', authorize('doctor', 'admin'), async (req, res, next) => {
  try {
    const { diagnosis, recommendations, prescription, followUpDate, severity } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        doctor: req.user._id,
        'doctorReview.reviewed': true,
        'doctorReview.reviewedAt': new Date(),
        'doctorReview.diagnosis': diagnosis,
        'doctorReview.recommendations': recommendations,
        'doctorReview.prescription': prescription,
        'doctorReview.followUpDate': followUpDate,
        'doctorReview.severity': severity,
        status: 'doctor-reviewed',
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

export default router;

