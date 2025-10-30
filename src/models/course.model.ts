import mongoose, { Schema, Document } from "mongoose";

/**
 * Defines user access levels within NoaTrans
 * - Learner: Can enroll in courses and take quizzes
 * - Facilitator: Can create, edit, and manage courses/lessons
 * - Admin: Full access including user management
 */
export type RoleType = "Learner" | "Facilitator" | "Admin";

export interface IUser extends Document {
  fullName: string;
  userName: string;
  email: string;
  passwordHash: string;
  role: RoleType;
  isActive: boolean;
  isDeleted: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  learners: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    fullName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userName: {
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    passwordHash: {
      type: String,
      required: true 
    },
    role: {
      type: String,
      enum: ["Learner", "Facilitator", "Admin"],
      default: "Learner", 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    avatarUrl: { 
      type: String 
    },
    learners: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
