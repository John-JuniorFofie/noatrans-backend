import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const uri =  process.env.MONGO_URL;
    if (!uri) {
      throw new Error(
        'Missing MongoDB connection string: set MONGO_URI or MONGO_URL in your .env file'
      );
    }

    const conn = await mongoose.connect(uri as string, {
      // optional, helps ensure connection stability
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection failed:", error instanceof Error ? error.message : error);
    process.exit(1); // Stop app if DB fails
  }
};

export default connectDB;