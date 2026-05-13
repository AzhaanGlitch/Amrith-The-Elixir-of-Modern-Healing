import express from 'express';
import User from '../models/User.model.js';
import Appointment from '../models/Appointment.model.js';
import Report from '../models/Report.model.js';
import Contact from '../models/Contact.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import crypto from 'crypto';

const router = express.Router();
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, pendingAppointments, completedAppointments, totalReports, unreadContacts] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'completed' }),
      Report.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
    ]);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { totalPatients, totalDoctors, totalAppointments, pendingAppointments, completedAppointments, totalReports, unreadContacts },
      recentAppointments,
    });
  } catch (error) { next(error); }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, count: users.length, total, users });
  } catch (error) { next(error); }
});

// PATCH /api/admin/users/:id/toggle — activate/deactivate
router.patch('/users/:id/toggle', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) { next(error); }
});

// PATCH /api/admin/doctors/:id/verify
router.patch('/doctors/:id/verify', async (req, res, next) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    doctor.verified = true;
    await doctor.save();
    res.json({ success: true, message: 'Doctor verified', doctor });
  } catch (error) { next(error); }
});

// POST /api/admin/generate-code
router.post('/generate-code', (req, res) => {
  const { type = 'doctor', prefix = 'AMR' } = req.body;
  const code = `${prefix}-${type.toUpperCase().slice(0, 3)}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  res.json({ success: true, code, type, generatedAt: new Date().toISOString() });
});

export default router;
