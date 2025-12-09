import mongoose from 'mongoose';
import User from './models/user.js';
import Issue from './models/issue.js';
import 'dotenv/config';

async function createTestIssues() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the citizen user
    const citizen = await User.findOne({ email: 'citizen@publicreport.com' });
    if (!citizen) {
      console.error('❌ Citizen user not found. Please run: npm run seed:citizen');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('✅ Found citizen user:', citizen.name);

    // Check existing issues count
    const existingIssues = await Issue.countDocuments({ createdBy: citizen._id });
    console.log(`📊 Citizen currently has ${existingIssues} issue(s)`);

    if (existingIssues >= 2) {
      console.log('✅ Citizen already has 2 or more issues');
      await mongoose.connection.close();
      return;
    }

    console.log('📝 Creating test issues...');

    // Issue 1: Broken Streetlight
    const issue1 = await Issue.create({
      title: 'Broken Streetlight on Main Road',
      description: 'The streetlight near the community center on Main Road has been out for 3 days. This area becomes very dark at night, making it unsafe for pedestrians and causing security concerns for nearby residents. The light was working fine until last Monday. Please fix this as soon as possible.',
      category: 'Streetlight',
      location: 'Main Road, near Community Center, Dhaka',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop',
      status: 'pending',
      priority: 'normal',
      createdBy: citizen._id,
      upvotes: [],
      isBoosted: false,
      timeline: [
        {
          status: 'pending',
          message: 'Issue reported by citizen',
          updatedBy: citizen._id,
          updatedByRole: 'citizen',
          createdAt: new Date()
        }
      ]
    });

    console.log('✅ Created Issue 1: Broken Streetlight');

    // Issue 2: Pothole on Highway
    const issue2 = await Issue.create({
      title: 'Large Pothole Causing Traffic Issues',
      description: 'There is a very large pothole on the highway near the shopping mall entrance. It has been growing bigger with recent rains and is now causing significant traffic problems. Several vehicles have already been damaged. The pothole is approximately 2 feet wide and 6 inches deep. Urgent repair needed to prevent accidents.',
      category: 'Pothole',
      location: 'Highway Road, Mall Entrance, Dhaka',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop',
      status: 'pending',
      priority: 'normal',
      createdBy: citizen._id,
      upvotes: [],
      isBoosted: false,
      timeline: [
        {
          status: 'pending',
          message: 'Issue reported by citizen',
          updatedBy: citizen._id,
          updatedByRole: 'citizen',
          createdAt: new Date()
        }
      ]
    });

    console.log('✅ Created Issue 2: Large Pothole');

    console.log('');
    console.log('=================================');
    console.log('✅ Successfully created 2 test issues!');
    console.log('=================================');
    console.log('');
    console.log('📋 Issue 1:');
    console.log('   Title:', issue1.title);
    console.log('   Category:', issue1.category);
    console.log('   Status:', issue1.status);
    console.log('   Location:', issue1.location);
    console.log('');
    console.log('📋 Issue 2:');
    console.log('   Title:', issue2.title);
    console.log('   Category:', issue2.category);
    console.log('   Status:', issue2.status);
    console.log('   Location:', issue2.location);
    console.log('');
    console.log('💡 Citizen (citizen@publicreport.com) now has 2/3 issues created');
    console.log('💡 They can create 1 more issue before hitting the free user limit');
    console.log('');
    console.log('Next steps:');
    console.log('1. Login as Admin and assign these issues to staff');
    console.log('2. Login as Staff and update issue status');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating issues:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createTestIssues();
