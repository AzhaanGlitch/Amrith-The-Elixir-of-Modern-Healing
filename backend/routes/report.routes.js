import express from 'express';
import Report from '../models/Report.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

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

// ─── GET /api/reports/:id ────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient', 'name email phone avatar age gender bloodGroup')
      .populate('doctor', 'name email specialization')
      .populate('appointment');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report });
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
