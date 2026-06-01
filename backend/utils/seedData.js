/**
 * Seed script — populates the database with initial data for development.
 * Uses upsert logic so existing accounts are preserved.
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
    name: 'Amrith Admin',
    email: 'admin@amrith.com',
    password: 'amrith123',
    role: 'admin',
  },
  // ── Specialist Doctors ──────────────────────────────────────
  {
    name: 'Priya Sharma',
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
    name: 'Arjun Mehta',
    email: 'derma@amrith.com',
    password: 'amrith123',
    phone: '+91 91234 56780',
    role: 'doctor',
    specialization: 'Dermatology',
    experience: '8 years',
    qualification: 'MBBS, MD (Dermatology)',
    verified: true,
  },
  {
    name: 'Kavitha Reddy',
    email: 'cardio@amrith.com',
    password: 'amrith123',
    phone: '+91 92345 67891',
    role: 'doctor',
    specialization: 'Cardiovascular',
    experience: '15 years',
    qualification: 'MBBS, DM (Cardiology)',
    verified: true,
  },
  {
    name: 'Rahul Verma',
    email: 'neuro@amrith.com',
    password: 'amrith123',
    phone: '+91 93456 78902',
    role: 'doctor',
    specialization: 'Neurology',
    experience: '10 years',
    qualification: 'MBBS, DM (Neurology)',
    verified: true,
  },
  {
    name: 'Sneha Iyer',
    email: 'pulmo@amrith.com',
    password: 'amrith123',
    phone: '+91 94567 89013',
    role: 'doctor',
    specialization: 'Pulmonology',
    experience: '9 years',
    qualification: 'MBBS, MD (Pulmonary Medicine)',
    verified: true,
  },
  {
    name: 'Vikram Das',
    email: 'ortho@amrith.com',
    password: 'amrith123',
    phone: '+91 95678 90124',
    role: 'doctor',
    specialization: 'Orthopedics',
    experience: '11 years',
    qualification: 'MBBS, MS (Orthopedics)',
    verified: true,
  },
  {
    name: 'Ananya Nair',
    email: 'ophthal@amrith.com',
    password: 'amrith123',
    phone: '+91 96789 01235',
    role: 'doctor',
    specialization: 'Ophthalmology',
    experience: '7 years',
    qualification: 'MBBS, MS (Ophthalmology)',
    verified: true,
  },
  {
    name: 'Deepak Kumar',
    email: 'onco@amrith.com',
    password: 'amrith123',
    phone: '+91 97890 12346',
    role: 'doctor',
    specialization: 'Oncology',
    experience: '14 years',
    qualification: 'MBBS, DM (Medical Oncology)',
    verified: true,
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

    // Upsert each user by email to avoid data loss
    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`  ⏭️  Skipped (already exists): ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`  ✅ Created ${userData.role}: ${userData.email}`);
      }
    }

    console.log('\n🌱 Database seeded successfully!');
    console.log('   Login credentials (all passwords: amrith123):');
    console.log('   Patient: user@amrith.com');
    console.log('   Doctor:  doctor@amrith.com (+ specialist emails)');
    console.log('   Admin:   admin@amrith.com\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
