import express from 'express';
import jwt from 'jsonwebtoken';
import Review from '../models/Review.model.js';
import User from '../models/User.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ─── GET /api/reviews ───────────────────────────────────────
// Get all reviews (public)
router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .sort({ rating: -1, createdAt: -1 });
    
    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/reviews ──────────────────────────────────────
// Submit a review (public, optional auth)
router.post('/', async (req, res, next) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || rating === undefined || !comment) {
      return res.status(400).json({ error: 'Name, rating, and comment are required' });
    }

    let userId = null;

    // Check if the user is authenticated (optional)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          userId = user._id;
        }
      } catch (err) {
        // Ignore invalid token and post as guest
      }
    }

    const review = await Review.create({
      name,
      rating: Number(rating),
      comment,
      userId,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/reviews/:id ───────────────────────────────
// Delete a review (requires auth)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Verify ownership: must be the user who wrote the review, or an admin
    const isOwner = review.userId && review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to delete this review' });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
