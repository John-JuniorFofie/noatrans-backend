import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    title: {
      type: String,
    },

    type: {
      type: String,
      enum: ["lesson", "assignment"],
    },

    score: {
      type: Number,
    },

    total: {
      type: Number,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);