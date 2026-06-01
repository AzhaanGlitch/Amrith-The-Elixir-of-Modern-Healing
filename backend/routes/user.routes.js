import express from 'express';
import User from '../models/User.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

// GET /api/users/profile
router.get('/profile', (req, res) => {
  res.json({ success: true, user: req.user });
});

// GET /api/users/doctors — List active doctors, optionally filtered by specialization
router.get('/doctors', async (req, res, next) => {
  try {
    const { specialization } = req.query;
    const query = { role: 'doctor', isActive: true };
    
    if (specialization) {
      // Support comma-separated specializations (e.g. Dermatology,Oncology) by converting to a regex union pattern
      const specPattern = specialization.split(',').map(s => s.trim()).filter(Boolean).join('|');
      if (specPattern) {
        query.specialization = { $regex: new RegExp(specPattern, 'i') };
      }
    }

    const doctors = await User.find(query).select('name email phone avatar specialization experience qualification');
    res.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/profile — Update profile
router.patch('/profile', async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'address', 'age', 'gender', 'dob', 'bloodGroup', 'specialization', 'experience', 'qualification'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) { next(error); }
});

// PATCH /api/users/password — Change password
router.patch('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
});

export default router;
