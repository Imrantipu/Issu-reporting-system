import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import issuesRouter from './routes/issues.js';
import adminRouter from './routes/admin.js';
import staffRouter from './routes/staff.js';
import paymentsRouter from './routes/payments.js';
import usersRouter from './routes/users.js';

dotenv.config();

const requiredEnv = [
  'MONGODB_URI',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY'
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[config] Missing env var: ${key}`);
  }
});

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
    if (!origin || allowed.length === 0 || allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Firebase Admin init
try {
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: firebasePrivateKey
      })
    });
    console.log('[firebase] Admin initialized');
  }
} catch (err) {
  console.error('[firebase] Init error', err.message);
}

// Mongo connection
const mongoUri = process.env.MONGODB_URI;
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoUri)
  .then(() => console.log('[mongo] Connected'))
  .catch((err) => console.error('[mongo] Connection error', err.message));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: process.env.APP_NAME || 'Public Infrastructure Issue Reporting' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: process.env.APP_NAME || 'Public Infrastructure Issue Reporting' });
});

app.use('/issues', issuesRouter);
app.use('/admin', adminRouter);
app.use('/staff', staffRouter);
app.use('/payments', paymentsRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
  console.error('[error]', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`[server] Running on port ${port}`);
});
