import express from 'express';
import User from '../models/User.model.js';
import { generateToken, userResponse } from '../utils/generateToken.js';

const router = express.Router();

// ─── POST /api/auth/signup ───────────────────────────────────
// Register a new user (patient, doctor, or admin)
router.post('/signup', async (req, res, next) => {
  try {
    const {
      name, email, password, phone, role,
      // Patient fields
      address, dob, gender, bloodGroup,
      // Doctor fields
      specialization, licenseNumber, experience, qualification,
      // Admin
      adminCode,
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Admin verification
    if (role === 'admin') {
      const adminSecret = process.env.ADMIN_SECRET_CODE;
      if (!adminSecret || adminCode !== adminSecret) {
        return res.status(403).json({ error: 'Invalid admin registration code' });
      }
    }

    // Create user
    const user = await User.create({
      name: name || email.split('@')[0],
      email,
      password,
      phone,
      role: role || 'patient',
      // Patient
      address,
      dob,
      gender,
      bloodGroup,
      // Doctor
      specialization,
      licenseNumber,
      experience,
      qualification,
    });

    userResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/auth/login ────────────────────────────────────
// Login with email and password
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify role matches if specified
    if (role && user.role !== role) {
      return res.status(401).json({
        error: `No ${role} account found with this email. Try signing in as '${user.role}'.`,
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated. Contact support.' });
    }

    userResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────
// Get current user profile (requires auth)
import { protect } from '../middleware/auth.middleware.js';

router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// ─── PUT /api/auth/profile ───────────────────────────────────
// Update user profile (used for onboarding and profile edits)
router.put('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      name, phone, address, dob, gender, bloodGroup,
      specialization, licenseNumber, experience, qualification,
      profileImage
    } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (specialization !== undefined) user.specialization = specialization;
    if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
    if (experience !== undefined) user.experience = experience;
    if (qualification !== undefined) user.qualification = qualification;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updatedUser = await user.save();
    
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
