import mongoose from 'mongoose';

const { Schema } = mongoose;

export const PAYMENT_TYPES = ['boost', 'subscription'];
export const PAYMENT_STATUS = ['pending', 'succeeded', 'failed'];

const PaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue', index: true },
    type: { type: String, enum: PAYMENT_TYPES, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'bdt' },
    stripePaymentIntentId: { type: String, index: true },
    stripeChargeId: { type: String },
    status: { type: String, enum: PAYMENT_STATUS, default: 'pending' },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);
