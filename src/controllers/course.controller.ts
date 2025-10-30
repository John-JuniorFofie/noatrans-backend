import type { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Course from "../models/course.model.ts";
import Enrollment from "../models/enrollment.model.ts";
import type { AuthRequest } from "../types/authRequest.ts";
// import type{ EnrollmentStatus } from "../models/enrollment.model.ts";

/**
 * ================================
 *  FACILITATOR ACTIONS
 * ================================
 */

/**
 * @description Facilitator creates a new course
 * @route POST /api/v1/courses
 * @access Facilitator
 */
export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, category, tags, price, durationMinutes } = req.body;
    const user = req.user;

    if (!user || user.role !== "Facilitator") {
      return res.status(403).json({ success: false, message: "Access denied. Facilitators only." });
    }

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const newCourse = await Course.create({
      title,
      description,
      category,
      tags,
      price,
      durationMinutes,
      instructorId: new mongoose.Types.ObjectId(user.userId),
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    next(error);
  }
};

/**
 * ================================
 *  LEARNER ACTIONS
 * ================================
 */

/**
 * @description Learner enrolls in a course
 * @route POST /api/v1/courses/:id/enroll
 * @access Learner
 */
export const enrollInCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: courseId } = req.params;
    const user = req.user;

    if (!user || user.role !== "Learner") {
      return res.status(403).json({ success: false, message: "Access denied. Learners only." });
    }

    const course = await Course.findOne({ _id: courseId, isDeleted: false });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const existingEnrollment = await Enrollment.findOne({
      userId: user.userId,
      courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      userId: new mongoose.Types.ObjectId(user.userId),
      courseId: new mongoose.Types.ObjectId(courseId),
      status: "approved",
    });

    course.learners.push(new mongoose.Types.ObjectId(req.user?.userId));
    await course.save();

    res.status(200).json({
      success: true,
      message: "Enrollment successful",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    next(error);
  }
};


/**
 * ================================
 *  FACILITATOR &  ADMIN ACTIONS
 * ================================
 */

/**
 * @description Facilitator/Admin updates a course
 * @route PATCH /api/v1/courses/:id
 * @access Facilitator, Admin
 */
export const updateCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: courseId } = req.params;
    const updates = req.body;
    const user = req.user;

    if (!user || (user.role !== "Facilitator" && user.role !== "Admin")) {
      return res.status(403).json({ success: false, message: "Access denied. Facilitator or Admin only." });
    }

    const course = await Course.findOneAndUpdate(
      { _id: courseId, isDeleted: false },
      { $set: updates },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    next(error);
  }
};

/**
 * @description Facilitator/Admin deletes a course (soft delete)
 * @route DELETE /api/v1/courses/:id
 * @access Facilitator, Admin
 */
export const deleteCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: courseId } = req.params;
    const user = req.user;

    if (!user || (user.role !== "Facilitator" && user.role !== "Admin")) {
      return res.status(403).json({ success: false, message: "Access denied. Facilitator or Admin only." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.isDeleted = true;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    next(error);
  }
};

/**
 * ================================
 *  PUBLIC ACTIONS
 * ================================
 */

/**
 * @description Get all published, non-deleted courses
 * @route GET /api/v1/courses
 * @access Public
 */
export const getAllCourses = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find({ isDeleted: false }).populate("instructorId", "fullName email role");
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    next(error);
  }
};

/**
 * @description Get details of a single course
 * @route GET /api/v1/courses/:id
 * @access Public
 */
export const getCourseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id, isDeleted: false }).populate("instructorId", "fullName email role");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    next(error);
  }
};
// Get all courses a learner enrolled in
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const enrollments = await Enrollment.find({ userId }).populate("courseId", "title description language level");

    res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: enrollments,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update learner's progress in a course
export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { enrollmentId } = req.params;
    const { progressPercent } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });

    enrollment.progressPercent = progressPercent;
    if (progressPercent >= 100) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

