
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: String,
  videoUrl: String,
  duration: Number, 
  order: Number,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  score: Number,
  completedAt: Date,
  type:{
    type: String,
    enum: ["lesson", "assignment"],
  },
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);
