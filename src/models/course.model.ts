import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface ICourse
 * Represents a language course on the NoaTrans platform.
 */
export interface ICourse extends Document {
  title: string;
  description: string;
  language: string;
  level: string;
  Facilitator?: mongoose.Types.ObjectId; // user who created the course
  // Learners: mongoose.Types.ObjectId[];   // users enrolled in this course
  Admin:mongoose.Types.ObjectId; //users who manages the entire system
  enrollment?: mongoose.Types.ObjectId[]; // users who requested to join the course
  isDeleted: boolean;
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    Facilitator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // Learners: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    Admin: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
