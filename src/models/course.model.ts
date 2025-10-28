import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  language: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  instructor: string;
  lessons?: string[]; 
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    lessons: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
