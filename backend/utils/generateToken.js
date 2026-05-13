import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for a user
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'amrith-dev-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Format user response with token
 */
export const userResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      profileImage: user.profileImage,
      // Patient fields
      age: user.age,
      gender: user.gender,
      dob: user.dob,
      bloodGroup: user.bloodGroup,
      address: user.address,
      // Doctor fields
      specialization: user.specialization,
      experience: user.experience,
      qualification: user.qualification,
      verified: user.verified,
    },
  });
};
