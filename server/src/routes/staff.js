import express from 'express';
import Issue, { ISSUE_STATUSES } from '../models/issue.js';
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

const allowedTransitions = {
  'pending': ['in-progress'],
  'in-progress': ['working'],
  'working': ['resolved'],
  'resolved': ['closed'],
  'closed': [],
  'rejected': []
};

router.use(verifyAuth, requireRole('staff'));

// List assigned issues for staff
router.get('/issues', async (req, res) => {
  try {
    const staffId = req.user._id;
    const issues = await Issue.find({ assignedStaff: staffId })
      .populate('createdBy', 'name email role photoUrl')
      .sort({ isBoosted: -1, priority: -1, createdAt: -1 });
    return res.json(issues);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Change status with allowed transitions
router.post('/issues/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !ISSUE_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (!issue.assignedStaff || issue.assignedStaff.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not assigned to you' });
    }

    const nextAllowed = allowedTransitions[issue.status] || [];
    if (!nextAllowed.includes(status)) {
      return res.status(400).json({ message: 'Transition not allowed' });
    }

    issue.status = status;
    addTimeline(issue, { status, message: `Status changed to ${status}`, user: req.user });
    await issue.save();
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
