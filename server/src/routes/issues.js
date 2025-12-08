import express from 'express';
import Issue, { ISSUE_PRIORITIES, ISSUE_STATUSES } from '../models/issue.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

const sanitizeUpdate = (payload) => {
  const allowed = ['title', 'description', 'category', 'location', 'imageUrl'];
  const update = {};
  allowed.forEach((key) => {
    if (payload[key] !== undefined) update[key] = payload[key];
  });
  return update;
};

const addTimeline = (issue, { status, message, user }) => {
  issue.timeline.push({
    status,
    message,
    updatedByRole: user?.role,
    updatedBy: user?._id
  });
};

router.post('/', verifyAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user.blocked) return res.status(403).json({ message: 'Blocked users cannot submit issues' });

    if (!user.premium) {
      const count = await Issue.countDocuments({ createdBy: user._id });
      if (count >= 3) {
        return res.status(403).json({ message: 'Free users can submit up to 3 issues. Subscribe to add more.' });
      }
    }

    const { title, description, category, location, imageUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const issue = new Issue({
      title,
      description,
      category,
      location,
      imageUrl,
      createdBy: user._id,
      status: 'pending',
      priority: 'normal'
    });
    addTimeline(issue, { status: 'pending', message: 'Issue reported', user });
    await issue.save();
    await issue.populate('createdBy', 'name email role photoUrl');
    return res.status(201).json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/', verifyAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;
    const { q, category, status, priority, mine } = req.query;

    const filter = {};
    if (mine === 'true') {
      filter.createdBy = req.user._id;
    }
    if (category) filter.category = category;
    if (status && ISSUE_STATUSES.includes(status)) filter.status = status;
    if (priority && ISSUE_PRIORITIES.includes(priority)) filter.priority = priority;

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex }
      ];
    }

    const sort = { isBoosted: -1, priority: -1, createdAt: -1 };
    const total = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email role photoUrl')
      .populate('assignedStaff', 'name email role photoUrl')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.json({ total, page, limit, data: issues });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', verifyAuth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email role photoUrl')
      .populate('assignedStaff', 'name email role photoUrl')
      .populate('timeline.updatedBy', 'name email role');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', verifyAuth, async (req, res) => {
  try {
    const user = req.user;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can edit this issue' });
    }
    if (issue.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending issues can be edited' });
    }
    const update = sanitizeUpdate(req.body);
    Object.assign(issue, update);
    addTimeline(issue, { status: issue.status, message: 'Issue updated', user });
    await issue.save();
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const user = req.user;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete this issue' });
    }
    await issue.deleteOne();
    return res.json({ message: 'Issue deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/:id/upvote', verifyAuth, async (req, res) => {
  try {
    const user = req.user;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.createdBy.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Cannot upvote your own issue' });
    }
    const already = issue.upvotes.some((u) => u.toString() === user._id.toString());
    if (already) return res.status(400).json({ message: 'Already upvoted' });
    issue.upvotes.push(user._id);
    await issue.save();
    return res.json({ upvotes: issue.upvotes.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
