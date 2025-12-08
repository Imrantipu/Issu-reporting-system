import express from 'express';
import firebaseAdmin from 'firebase-admin';
import Issue from '../models/issue.js';
import User from '../models/user.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const addTimeline = (issue, { status, message, user }) => {
  issue.timeline.push({
    status,
    message,
    updatedByRole: user?.role,
    updatedBy: user?._id
  });
};

router.use(verifyAuth, requireRole('admin'));

// Get all citizen users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' }).sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get admin statistics
router.get('/stats', async (req, res) => {
  try {
    const Issue = (await import('../models/issue.js')).default;
    const Payment = (await import('../models/payment.js')).default;

    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const rejectedIssues = await Issue.countDocuments({ status: 'rejected' });
    const inProgressIssues = await Issue.countDocuments({ status: { $in: ['in-progress', 'working'] } });

    const totalPayments = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalUsers = await User.countDocuments({ role: 'citizen' });
    const premiumUsers = await User.countDocuments({ role: 'citizen', premium: true });
    const blockedUsers = await User.countDocuments({ blocked: true });

    const latestIssues = await Issue.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const latestPayments = await Payment.find({ status: 'succeeded' })
      .populate('user', 'name email')
      .populate('issue', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    const latestUsers = await User.find({ role: 'citizen' })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      totalIssues,
      resolvedIssues,
      pendingIssues,
      rejectedIssues,
      inProgressIssues,
      totalPaymentAmount: totalPayments[0]?.total || 0,
      totalUsers,
      premiumUsers,
      blockedUsers,
      latestIssues,
      latestPayments,
      latestUsers
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Assign staff (only if none assigned yet, status remains pending)
router.post('/issues/:id/assign-staff', async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ message: 'staffId is required' });

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.assignedStaff) return res.status(400).json({ message: 'Staff already assigned' });

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== 'staff') {
      return res.status(400).json({ message: 'Invalid staff user' });
    }

    issue.assignedStaff = staff._id;
    addTimeline(issue, {
      status: issue.status,
      message: `Assigned to staff: ${staff.name || staff.email}`,
      user: req.user
    });
    await issue.save();
    await issue.populate('assignedStaff', 'name email role photoUrl');
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Reject pending issue
router.post('/issues/:id/reject', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.status !== 'pending') return res.status(400).json({ message: 'Only pending issues can be rejected' });
    issue.status = 'rejected';
    addTimeline(issue, { status: 'rejected', message: 'Issue rejected by admin', user: req.user });
    await issue.save();
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Block user
router.post('/users/:id/block', async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    target.blocked = true;
    await target.save();
    return res.json({ message: 'User blocked' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Unblock user
router.post('/users/:id/unblock', async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    target.blocked = false;
    await target.save();
    return res.json({ message: 'User unblocked' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// List staff
router.get('/staff', async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).sort({ createdAt: -1 });
    return res.json(staff);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create staff (Firebase Auth + DB)
router.post('/staff', async (req, res) => {
  try {
    const { name, email, password, phone, photoUrl } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Email and password (min 6 chars) are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    let fbUser;
    try {
      fbUser = await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: name,
        photoURL: photoUrl
      });
    } catch (err) {
      return res.status(400).json({ message: `Firebase createUser failed: ${err.message}` });
    }

    const staff = await User.create({
      firebaseUid: fbUser.uid,
      email,
      name,
      phone,
      photoUrl,
      role: 'staff'
    });

    return res.status(201).json(staff);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update staff (details/password/email)
router.patch('/staff/:id', async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    if (staff.role !== 'staff') return res.status(400).json({ message: 'User is not staff' });

    const { name, email, phone, photoUrl, password } = req.body;

    // Update Firebase user first when needed
    const firebaseUpdate = {};
    if (name) firebaseUpdate.displayName = name;
    if (photoUrl) firebaseUpdate.photoURL = photoUrl;
    if (email && email !== staff.email) firebaseUpdate.email = email;
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
      firebaseUpdate.password = password;
    }
    if (Object.keys(firebaseUpdate).length) {
      try {
        await firebaseAdmin.auth().updateUser(staff.firebaseUid, firebaseUpdate);
      } catch (err) {
        return res.status(400).json({ message: `Firebase update failed: ${err.message}` });
      }
    }

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (phone !== undefined) staff.phone = phone;
    if (photoUrl !== undefined) staff.photoUrl = photoUrl;
    await staff.save();

    return res.json(staff);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete staff (Firebase Auth + DB, unassign issues)
router.delete('/staff/:id', async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    if (staff.role !== 'staff') return res.status(400).json({ message: 'User is not staff' });

    const issues = await Issue.find({ assignedStaff: staff._id });
    for (const issue of issues) {
      issue.assignedStaff = null;
      addTimeline(issue, { status: issue.status, message: 'Staff removed; issue unassigned', user: req.user });
      await issue.save();
    }

    try {
      await firebaseAdmin.auth().deleteUser(staff.firebaseUid);
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        return res.status(400).json({ message: `Firebase delete failed: ${err.message}` });
      }
    }

    await staff.deleteOne();
    return res.json({ message: 'Staff deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
