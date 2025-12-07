import express from 'express';
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

export default router;
