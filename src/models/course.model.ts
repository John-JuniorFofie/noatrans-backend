import mongoose, { Schema, Document } from "mongoose";

/**
 * @enum Role
 * Defines user access levels within NoaTrans
 * - Learner: Can enroll in courses and take quizzes
 * - Facilitator: Can create, edit, and manage courses/lessons
 * - Admin: Full access including user management
 */
export enum Role {
  LEARNER = "Learner",
  FACILITATOR = "Facilitator",
  ADMIN = "Admin",
}

export interface IUser extends Document {
  fullName: string;
  userName: string;
  email: string;
  passwordHash: string;
  role: Role;
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
      enum: Object.values(Role),
      default: Role.LEARNER,
    },
    isActive: { 
      type: Boolean, 
      default: true },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    avatarUrl: { 
      type: 
      String 
    },
    learners: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
