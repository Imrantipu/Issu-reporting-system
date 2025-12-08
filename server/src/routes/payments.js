import express from 'express';
import Stripe from 'stripe';
import Issue from '../models/issue.js';
import Payment from '../models/payment.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const BOOST_AMOUNT_BDT = 100;
const SUBSCRIPTION_AMOUNT_BDT = 1000;
const CURRENCY = 'bdt';

const toMinorUnits = (amount) => Math.round(amount * 100); // BDT uses minor units

const addTimeline = (issue, { status, message, user }) => {
  issue.timeline.push({
    status,
    message,
    updatedByRole: user?.role,
    updatedBy: user?._id
  });
};

const ensureStripe = (res) => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe is not configured' });
    return false;
  }
  return true;
};

router.post('/boost-intent', verifyAuth, async (req, res) => {
  if (!ensureStripe(res)) return;
  try {
    const { issueId } = req.body;
    if (!issueId) return res.status(400).json({ message: 'issueId is required' });

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the issue owner can boost priority' });
    }
    if (issue.priority === 'high' || issue.isBoosted) {
      return res.status(400).json({ message: 'Issue is already boosted' });
    }

    const payment = await Payment.create({
      user: req.user._id,
      issue: issue._id,
      type: 'boost',
      amount: BOOST_AMOUNT_BDT,
      currency: CURRENCY,
      status: 'pending',
      metadata: { issueId }
    });

    const intent = await stripe.paymentIntents.create({
      amount: toMinorUnits(BOOST_AMOUNT_BDT),
      currency: CURRENCY,
      metadata: {
        paymentId: payment._id.toString(),
        issueId: issue._id.toString(),
        userId: req.user._id.toString(),
        type: 'boost'
      }
    });

    payment.stripePaymentIntentId = intent.id;
    await payment.save();

    res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/boost/confirm', verifyAuth, async (req, res) => {
  if (!ensureStripe(res)) return;
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return res.status(400).json({ message: 'paymentIntentId is required' });

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!intent) return res.status(404).json({ message: 'PaymentIntent not found' });
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed yet' });
    }

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId }).populate('issue');
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your payment' });
    }
    if (payment.status === 'succeeded') {
      return res.json({ message: 'Already processed' });
    }

    const issue = await Issue.findById(payment.issue);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.priority = 'high';
    issue.isBoosted = true;
    addTimeline(issue, {
      status: issue.status,
      message: `Issue boosted via payment ${paymentIntentId}`,
      user: req.user
    });
    await issue.save();

    payment.status = 'succeeded';
    payment.stripeChargeId = intent.latest_charge;
    await payment.save();

    res.json({ message: 'Boost applied', issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/subscription-intent', verifyAuth, async (req, res) => {
  if (!ensureStripe(res)) return;
  try {
    if (req.user.premium) {
      return res.status(400).json({ message: 'User already subscribed' });
    }

    const payment = await Payment.create({
      user: req.user._id,
      type: 'subscription',
      amount: SUBSCRIPTION_AMOUNT_BDT,
      currency: CURRENCY,
      status: 'pending'
    });

    const intent = await stripe.paymentIntents.create({
      amount: toMinorUnits(SUBSCRIPTION_AMOUNT_BDT),
      currency: CURRENCY,
      metadata: {
        paymentId: payment._id.toString(),
        userId: req.user._id.toString(),
        type: 'subscription'
      }
    });

    payment.stripePaymentIntentId = intent.id;
    await payment.save();

    res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/subscription/confirm', verifyAuth, async (req, res) => {
  if (!ensureStripe(res)) return;
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return res.status(400).json({ message: 'paymentIntentId is required' });

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!intent) return res.status(404).json({ message: 'PaymentIntent not found' });
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed yet' });
    }

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your payment' });
    }
    if (payment.status === 'succeeded') {
      return res.json({ message: 'Already processed' });
    }

    req.user.premium = true;
    req.user.subscription = {
      isActive: true,
      startedAt: new Date(),
      lastPaymentId: payment._id
    };
    await req.user.save();

    payment.status = 'succeeded';
    payment.stripeChargeId = intent.latest_charge;
    await payment.save();

    res.json({ message: 'Subscription activated', premium: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', verifyAuth, requireRole('admin'), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email role')
      .populate('issue', 'title')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
