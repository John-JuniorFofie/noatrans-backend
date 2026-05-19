import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  title: String,
  type: {
    type: String,
    enum: ["lesson", "assignment"],
  },
  score: Number,
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Activity", activitySchema);