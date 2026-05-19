
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: String,
  videoUrl: String,
  duration: Number, // in minutes
  order: Number,
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);