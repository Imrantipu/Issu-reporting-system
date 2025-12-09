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

// Citizen credentials
const CITIZEN_EMAIL = 'citizen@publicreport.com';
const CITIZEN_PASSWORD = 'Citizen123!@#';
const CITIZEN_NAME = 'Jane Smith';
const CITIZEN_PHONE = '+880 1787654321';

async function createCitizenUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if citizen already exists in database
    const existingCitizen = await User.findOne({ email: CITIZEN_EMAIL });
    if (existingCitizen) {
      console.log('✅ Citizen user already exists in database');
      console.log('📧 Email:', CITIZEN_EMAIL);
      console.log('🔑 Password:', CITIZEN_PASSWORD);
      console.log('👤 Role:', existingCitizen.role);
      console.log('💎 Premium:', existingCitizen.premium);

      await mongoose.connection.close();
      return;
    }

    console.log('🔥 Creating citizen user in Firebase...');

    // Check if user exists in Firebase
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(CITIZEN_EMAIL);
      console.log('✅ Citizen user already exists in Firebase');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create user in Firebase
        firebaseUser = await admin.auth().createUser({
          email: CITIZEN_EMAIL,
          password: CITIZEN_PASSWORD,
          displayName: CITIZEN_NAME,
          emailVerified: true,
        });
        console.log('✅ Citizen user created in Firebase');
      } else {
        throw error;
      }
    }

    console.log('💾 Creating citizen user in MongoDB...');

    // Create user in MongoDB with citizen role (free user)
    const citizenUser = await User.create({
      firebaseUid: firebaseUser.uid,
      email: CITIZEN_EMAIL,
      name: CITIZEN_NAME,
      phone: CITIZEN_PHONE,
      role: 'citizen',
      premium: false, // Free user - limited to 3 issues
      blocked: false,
    });

    console.log('✅ Citizen user created successfully!');
    console.log('');
    console.log('=================================');
    console.log('📧 Email:', CITIZEN_EMAIL);
    console.log('🔑 Password:', CITIZEN_PASSWORD);
    console.log('👤 Name:', CITIZEN_NAME);
    console.log('📱 Phone:', CITIZEN_PHONE);
    console.log('🎯 Role:', citizenUser.role);
    console.log('💎 Premium:', citizenUser.premium ? 'Yes' : 'No (Free - 3 issues limit)');
    console.log('=================================');
    console.log('');
    console.log('You can now login with these credentials!');
    console.log('💡 Note: This is a FREE user, so they can only submit up to 3 issues');
    console.log('💡 After creating 2 issues, they will have 1 remaining slot');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating citizen user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createCitizenUser();
