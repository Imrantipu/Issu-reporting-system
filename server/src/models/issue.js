import mongoose from 'mongoose';
import { USER_ROLES } from './user.js';

const { Schema } = mongoose;

export const ISSUE_STATUSES = ['pending', 'in-progress', 'working', 'resolved', 'closed', 'rejected'];
export const ISSUE_PRIORITIES = ['normal', 'high'];

const TimelineEntrySchema = new Schema(
  {
    status: { type: String, enum: ISSUE_STATUSES, required: true },
    message: { type: String },
    updatedByRole: { type: String, enum: USER_ROLES },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const IssueSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    category: { type: String, index: true },
    status: { type: String, enum: ISSUE_STATUSES, default: 'pending', index: true },
    priority: { type: String, enum: ISSUE_PRIORITIES, default: 'normal', index: true },
    location: { type: String, index: true },
    imageUrl: { type: String },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedStaff: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    isBoosted: { type: Boolean, default: false },
    timeline: { type: [TimelineEntrySchema], default: [] }
  },
  { timestamps: true }
);

IssueSchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Issue', IssueSchema);
