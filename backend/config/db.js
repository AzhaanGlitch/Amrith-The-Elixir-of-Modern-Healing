import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.warn('⚠️  MONGODB_URI not set in .env — skipping database connection.');
      console.warn('   The server will run but database operations will fail.');
      console.warn('   Add your MongoDB Atlas URI to backend/.env to enable persistence.\n');
      return;
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't crash the server — let it run so frontend can still be developed
    console.warn('   Server will continue running without database connectivity.\n');
  }
};

export default connectDB;
