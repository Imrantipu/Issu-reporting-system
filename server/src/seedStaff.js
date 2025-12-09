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

// Staff credentials
const STAFF_EMAIL = 'staff@publicreport.com';
const STAFF_PASSWORD = 'Staff123!@#';
const STAFF_NAME = 'John Doe';
const STAFF_PHONE = '+880 1712345678';

async function createStaffUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if staff already exists in database
    const existingStaff = await User.findOne({ email: STAFF_EMAIL });
    if (existingStaff) {
      console.log('✅ Staff user already exists in database');
      console.log('📧 Email:', STAFF_EMAIL);
      console.log('🔑 Password:', STAFF_PASSWORD);
      console.log('👤 Role:', existingStaff.role);

      // Make sure the role is staff
      if (existingStaff.role !== 'staff') {
        existingStaff.role = 'staff';
        await existingStaff.save();
        console.log('✅ Updated user role to staff');
      }

      await mongoose.connection.close();
      return;
    }

    console.log('🔥 Creating staff user in Firebase...');

    // Check if user exists in Firebase
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(STAFF_EMAIL);
      console.log('✅ Staff user already exists in Firebase');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create user in Firebase
        firebaseUser = await admin.auth().createUser({
          email: STAFF_EMAIL,
          password: STAFF_PASSWORD,
          displayName: STAFF_NAME,
          emailVerified: true,
        });
        console.log('✅ Staff user created in Firebase');
      } else {
        throw error;
      }
    }

    console.log('💾 Creating staff user in MongoDB...');

    // Create user in MongoDB with staff role
    const staffUser = await User.create({
      firebaseUid: firebaseUser.uid,
      email: STAFF_EMAIL,
      name: STAFF_NAME,
      phone: STAFF_PHONE,
      role: 'staff',
      premium: false,
      blocked: false,
    });

    console.log('✅ Staff user created successfully!');
    console.log('');
    console.log('=================================');
    console.log('📧 Email:', STAFF_EMAIL);
    console.log('🔑 Password:', STAFF_PASSWORD);
    console.log('👤 Name:', STAFF_NAME);
    console.log('📱 Phone:', STAFF_PHONE);
    console.log('🎯 Role:', staffUser.role);
    console.log('=================================');
    console.log('');
    console.log('You can now login with these credentials!');
    console.log('💡 Note: Admin can assign issues to this staff member');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating staff user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createStaffUser();
