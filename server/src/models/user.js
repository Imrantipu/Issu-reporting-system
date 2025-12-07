import mongoose from 'mongoose';

const { Schema } = mongoose;

export const USER_ROLES = ['admin', 'staff', 'citizen'];

const SubscriptionSchema = new Schema(
  {
    isActive: { type: Boolean, default: false },
    lastPaymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    startedAt: Date
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    name: { type: String },
    photoUrl: { type: String },
    phone: { type: String },
    role: { type: String, enum: USER_ROLES, default: 'citizen' },
    premium: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    subscription: { type: SubscriptionSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
