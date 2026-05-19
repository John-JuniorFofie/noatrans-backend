import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
    },

    duration: {
      type: Number,
    },

    order: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);