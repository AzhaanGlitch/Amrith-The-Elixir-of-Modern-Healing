/**
 * Seed script — populates the database with initial data for development.
 * Run: npm run seed
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const seedUsers = [
  {
    name: 'Amrith User',
    email: 'user@amrith.com',
    password: 'amrith123',
    phone: '+91 98765 43210',
    role: 'patient',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+',
    address: '42, 3rd Cross, HSR Layout, Bangalore - 560102',
  },
  {
    name: 'Amrith Dr.',
    email: 'doctor@amrith.com',
    password: 'amrith123',
    phone: '+91 87654 32109',
    role: 'doctor',
    specialization: 'Internal Medicine',
    experience: '12 years',
    qualification: 'MBBS, MD (Internal Medicine)',
    verified: true,
  },
  {
    name: 'Amrith Admin',
    email: 'admin@amrith.com',
    password: 'amrith123',
    role: 'admin',
  },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI not set in .env — cannot seed database.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Insert seed users
    for (const userData of seedUsers) {
      await User.create(userData);
      console.log(`  ✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n🌱 Database seeded successfully!');
    console.log('   Login credentials (all passwords: amrith123):');
    console.log('   Patient: user@amrith.com');
    console.log('   Doctor:  doctor@amrith.com');
    console.log('   Admin:   admin@amrith.com\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
