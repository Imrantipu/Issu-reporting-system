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

// Get staff statistics
router.get('/stats', async (req, res) => {
  try {
    const staffId = req.user._id;

    const assignedIssuesCount = await Issue.countDocuments({ assignedStaff: staffId });
    const resolvedIssuesCount = await Issue.countDocuments({ assignedStaff: staffId, status: 'resolved' });
    const inProgressIssuesCount = await Issue.countDocuments({ assignedStaff: staffId, status: { $in: ['in-progress', 'working'] } });
    const pendingIssuesCount = await Issue.countDocuments({ assignedStaff: staffId, status: 'pending' });

    return res.json({
      assignedIssuesCount,
      resolvedIssuesCount,
      inProgressIssuesCount,
      pendingIssuesCount
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// List assigned issues for staff
router.get('/issues', async (req, res) => {
  try {
    const staffId = req.user._id;
    const {status, limit} = req.query;

    const filter = { assignedStaff: staffId };
    if (status) filter.status = status;

    let query = Issue.find(filter)
      .populate('createdBy', 'name email role photoUrl')
      .sort({ isBoosted: -1, priority: -1, createdAt: -1 });

    if (limit) query = query.limit(parseInt(limit));

    const issues = await query;
    return res.json(issues);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Alias for assigned-issues (client compatibility)
router.get('/assigned-issues', async (req, res) => {
  try {
    const staffId = req.user._id;
    const { status, limit } = req.query;

    const filter = { assignedStaff: staffId };
    if (status) filter.status = status;

    let query = Issue.find(filter)
      .populate('createdBy', 'name email role photoUrl')
      .sort({ isBoosted: -1, priority: -1, createdAt: -1 });

    if (limit) query = query.limit(parseInt(limit));

    const issues = await query;
    return res.json({ data: issues });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update status with message (client compatibility)
router.patch('/issues/:id/update-status', async (req, res) => {
  try {
    const { status, message } = req.body;
    if (!status || !ISSUE_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (!issue.assignedStaff || issue.assignedStaff.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not assigned to you' });
    }

    issue.status = status;
    addTimeline(issue, {
      status,
      message: message || `Status changed to ${status}`,
      user: req.user
    });
    await issue.save();
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
