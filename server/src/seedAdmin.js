import admin from 'firebase-admin';
import mongoose from 'mongoose';
import User from './models/user.js';
import 'dotenv/config';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Admin credentials
const ADMIN_EMAIL = 'admin@publicreport.com';
const ADMIN_PASSWORD = 'Admin123!@#';
const ADMIN_NAME = 'System Administrator';

async function createAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists in database
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('✅ Admin user already exists in database');
      console.log('📧 Email:', ADMIN_EMAIL);
      console.log('🔑 Password:', ADMIN_PASSWORD);
      console.log('👤 Role:', existingAdmin.role);

      // Make sure the role is admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }

      await mongoose.connection.close();
      return;
    }

    console.log('🔥 Creating admin user in Firebase...');

    // Check if user exists in Firebase
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log('✅ Admin user already exists in Firebase');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create user in Firebase
        firebaseUser = await admin.auth().createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: ADMIN_NAME,
          emailVerified: true,
        });
        console.log('✅ Admin user created in Firebase');
      } else {
        throw error;
      }
    }

    console.log('💾 Creating admin user in MongoDB...');

    // Create user in MongoDB with admin role
    const adminUser = await User.create({
      firebaseUid: firebaseUser.uid,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'admin',
      premium: true,
      blocked: false,
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('=================================');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('👤 Name:', ADMIN_NAME);
    console.log('🎯 Role:', adminUser.role);
    console.log('=================================');
    console.log('');
    console.log('You can now login with these credentials!');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdminUser();
