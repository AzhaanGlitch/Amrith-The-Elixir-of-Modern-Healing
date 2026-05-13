import express from 'express';
import Contact from '../models/Contact.model.js';

const router = express.Router();

// ─── POST /api/contact ───────────────────────────────────────
// Submit a contact form (public — no auth needed)
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/contact (admin only) ───────────────────────────
import { protect, authorize } from '../middleware/auth.middleware.js';

router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: contacts.length,
      total,
      contacts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
