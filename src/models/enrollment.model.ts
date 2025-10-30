import mongoose, { Schema, Document } from "mongoose";

/**
 * @enum EnrollmentStatus
 * Describes the learner's enrollment lifecycle
 * - pending: awaiting approval (optional workflow)
 * - approved: learner can access the course
 * - rejected: enrollment denied by admin/facilitator
 * - completed: learner has finished the course
 */
export type EnrollmentStatus= "pending" |"approved" | "rejected" |"completed"

/**
 * @interface IEnrollment
 * Represents the relationship between a learner and a course
 */
export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId; // learner
  courseId: mongoose.Types.ObjectId; // course
  status: EnrollmentStatus;
  progressPercent: number;
  enrolledAt: Date;
  completedAt?: Date;
  isActive: boolean;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "approved",
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments for the same user + course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
const Enrollment =mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;

