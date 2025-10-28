import type { Request, Response, NextFunction } from "express";
import Course from "../models/course.model.ts";
import type { AuthRequest } from "../types/authRequest.ts";
import mongoose from "mongoose";
import users from "../models/user.model.ts";

/**
 *  Create a new course
 */
export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, language, duration } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized user" });
    }

    if (!title || !description || !language) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and language are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      language,
      duration,
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error({ message: "Error creating course", error });
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" });
  }
};

  //  apply for a course
export const applyCourse= async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, language } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized user" });
    }

    if (!title || !language) {
      return res.status(400).json({
        success: false,
        message: "Pickup and dropoff are required",
      });
    }

    const ride = await Course.create({
      title,
      language,
      rider: userId,
    });

    res.status(201).json({
      success: true,
      message: "Ride requested successfully.",
      data: ride,
    });
  } catch (error) {
    console.error({ message: "Error requesting ride", error });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


/**
 *  Get all active courses
 */
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ isDeleted: false }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error({ 
      message: "Error fetching courses", 
      error });
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" });
  }
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findOne({ _id: courseId, isDeleted: false });
    if (!course) {
      return res.status(404).json({
         success: false, 
         message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error({ 
      message: "Error fetching course", error });
    res.status(500).json({
       success: false, 
       error: "Internal server error" });
  }
};

/**
 *  Update a course
 */
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.userId;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const course = await Course.findOneAndUpdate(
      { _id: courseId, isDeleted: false },
      { $set: updates, updatedAt: new Date() },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error({ 
      message: "Error updating course", error });
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" });
  }
};

/**
 *  delete a course
 */
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const course = await Course.findOne({ _id: courseId, isDeleted: false });
    if (!course) {
      return res.status(404).json({
         success: false, 
         message: "Course not found" });
    }

    course.isDeleted = true;
    course.deletedAt = new Date();
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully ",
      data: course,
    });
  } catch (error) {
    console.error({ message: "Error deleting course", error });
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" });
  }
};