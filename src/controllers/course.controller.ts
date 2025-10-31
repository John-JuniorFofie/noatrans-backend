import type{ Request, Response } from "express";
import Course from "../models/course.model.ts";
import Enrollment from "../models/enrollment.model.ts";
import mongoose from "mongoose";

/**
 * 
 * COURSE CONTROLLERS — NOATRANS
 *
 * Facilitator → Create / Edit / Delete
 * Learner → Enroll
 * Admin → Edit / Delete / View all
 */

/** 
 *  FACILITATOR — CREATE COURSE
 *  */
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, language, level } = req.body;
    const facilitatorId = (req as any).user?.userId;
    const role = (req as any).user?.role;

    if (role !== "Facilitator" && role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only facilitators or admins can create courses.",
      });
    }

    if (!title || !description || !language || !level) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newCourse = await Course.create({
      title,
      description,
      language,
      level,
      facilitator: facilitatorId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** 
 *  GET ALL COURSES
 * */
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ isDeleted: false })
      .populate("Facilitator", "fullName email")

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully.",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** 
 *  GET SINGLE COURSE
 *  */
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const {courseId} = req.params;
    const course = await Course.findById(courseId)
      .populate("Facilitator", "fullName email")
      .populate("Learners", "fullName email");

    if (!course || course.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/** 
 *  FACILITATOR / ADMIN — UPDATE COURSE
 *  */
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const {courseId} = req.params;
    const {userId} = (req as any).user;
    const {role} = (req as any).user;
    const { title, description, language, level } = req.body;

    const course = await Course.findById(courseId);
    if (!course || course.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // only facilitator (who created) or admin can update
    if (
      role !== "Admin" &&
      course.Facilitator?.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course.",
      });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.language = language || course.language;
    course.level = level || course.level;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
       success: false, 
       message: "Internal server error" 
      });
  }
};

/** 
 *  FACILITATOR / ADMIN — DELETE COURSE (SOFT DELETE)
 *  */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const {courseId} = req.params;
    const {userId} = (req as any).user;
    const {role} = (req as any).user;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (
      role !== "Admin" &&
      course.Facilitator?.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course.",
      });
    }

    course.isDeleted = true;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

/** 
 *  ADMIN / FACILITATOR — RESTORE COURSE
 */
export const restoreCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { userId, role } = (req as any).user;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // only admin or the facilitator who created it can restore
    if (role !== "Admin" && course.Facilitator?.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to restore this course.",
      });
    }

    // if already active
    if (!course.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Course is already active.",
      });
    }

    course.isDeleted = false;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course restored successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Error restoring course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/** ==============================
 *  LEARNER — ENROLL IN COURSE
 * ============================== */
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const {userId} = (req as any).user;
    const {role }= (req as any).user;

    if (role !== "Learner") {
      return res.status(403).json({
        success: false,
        message: "Only learners can enroll in courses.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course || course.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unavailable.",
      });
    }

    // check if already enrolled
    if (await Enrollment.findOne({ userId, courseId })) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      courseId,
      userId,
      progressPercent: 0,
    });

    res.status(200).json({
      success: true,
      message: "Enrollment successful.",
      data: enrollment,
    });
    
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
       success: false, 
       message: "Internal server error" });
  }
};



/** 
 *  GET ALL  ENROLLED LEARNERS FOR ADMIN
 * */
export const getAllEnrolled = async (req: Request, res: Response) => {
  try {
   const {userId,role} = (req as any).user;

    if (role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view all enrolled learners.",
      });
    }
    const courses = await Enrollment.find({ isEnrolled: true })
      .populate("userId", "fullName email")

    res.status(200).json({
      success: true,
      message: "All Learners fetched successfully.",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};