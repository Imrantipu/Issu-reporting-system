import express from 'express';
import User from '../models/user.js';
import Payment from '../models/payment.js';
import Issue from '../models/issue.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current user
router.get('/me', verifyAuth, async (req, res) => {
  try {
    return res.json(req.user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update current user profile
router.patch('/me', verifyAuth, async (req, res) => {
  try {
    const { name, photoUrl, phone } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (photoUrl !== undefined) user.photoUrl = photoUrl;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get current user statistics
router.get('/me/stats', verifyAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalIssues = await Issue.countDocuments({ createdBy: userId });
    const pendingIssues = await Issue.countDocuments({ createdBy: userId, status: 'pending' });
    const inProgressIssues = await Issue.countDocuments({ createdBy: userId, status: { $in: ['in-progress', 'working'] } });
    const resolvedIssues = await Issue.countDocuments({ createdBy: userId, status: 'resolved' });
    const closedIssues = await Issue.countDocuments({ createdBy: userId, status: 'closed' });

    const totalPayments = await Payment.countDocuments({ user: userId, status: 'succeeded' });
    const totalPaymentAmount = await Payment.aggregate([
      { $match: { user: userId, status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return res.json({
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedIssues,
      closedIssues,
      totalPayments,
      totalPaymentAmount: totalPaymentAmount[0]?.total || 0
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get current user's payments
router.get('/me/payments', verifyAuth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('issue', 'title')
      .sort({ createdAt: -1 });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
