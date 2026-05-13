import express from 'express';
import Appointment from '../models/Appointment.model.js';
import Report from '../models/Report.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// All appointment routes require authentication
router.use(protect);

// ─── POST /api/appointments ──────────────────────────────────
// Create a new appointment (patient booking)
router.post('/', upload.array('files', 10), async (req, res, next) => {
  try {
    const {
      testId, testName, departmentName, inputType,
      answers, scheduledDate, scheduledTime,
      collectionType, address, patientFor,
      familyMemberName, familyMemberAge, familyMemberGender, familyMemberRelation,
    } = req.body;

    const appointmentData = {
      patient: req.user._id,
      testId,
      testName,
      departmentName,
      inputType,
      answers: answers ? JSON.parse(answers) : {},
      scheduledDate,
      scheduledTime,
      collectionType,
      address,
      patientFor: patientFor || 'self',
    };

    // Family member data
    if (patientFor === 'family') {
      appointmentData.familyMember = {
        name: familyMemberName,
        age: familyMemberAge,
        gender: familyMemberGender,
        relation: familyMemberRelation,
      };
    }

    // Attach uploaded files
    if (req.files && req.files.length > 0) {
      appointmentData.uploadedFiles = req.files.map(f => ({
        filename: f.filename,
        originalName: f.originalname,
        path: f.path,
        mimetype: f.mimetype,
        size: f.size,
      }));
    }

    const appointment = await Appointment.create(appointmentData);

    // Auto-create a report entry in "processing" state
    await Report.create({
      appointment: appointment._id,
      patient: req.user._id,
      testId,
      testName,
      departmentName,
      status: 'processing',
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/appointments ───────────────────────────────────
// Get appointments (filtered by role)
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    // Patients see only their own; doctors see assigned; admins see all
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email specialization avatar')
      .sort({ scheduledDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      count: appointments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      appointments,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/appointments/:id ───────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar age gender')
      .populate('doctor', 'name email specialization avatar');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Ensure user has access
    if (
      req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString() ||
      req.user.role === 'doctor' && appointment.doctor?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized to view this appointment' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /api/appointments/:id/status ──────────────────────
// Update appointment status (doctor or admin)
router.patch('/:id/status', authorize('doctor', 'admin'), async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /api/appointments/:id/assign ──────────────────────
// Assign a doctor to appointment (admin)
router.patch('/:id/assign', authorize('admin'), async (req, res, next) => {
  try {
    const { doctorId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId, status: 'confirmed' },
      { new: true }
    ).populate('doctor', 'name email specialization');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/appointments/:id ────────────────────────────
// Cancel an appointment
router.delete('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Only the patient who booked or admin can cancel
    if (
      req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
});

export default router;
