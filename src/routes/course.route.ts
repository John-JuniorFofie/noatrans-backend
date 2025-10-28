import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.ts";

import { authenticate } from "../middlewares/auth.middleware.ts";
import { authorizedRoles } from "../middlewares/rbac.middleware.ts";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API endpoints for managing Ghanaian language courses
 */

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create a new course
 *     description: Adds a new course to the platform with details such as title, description, level, and instructor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - language
 *               - description
 *               - level
 *               - duration
 *               - facilitator
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Twi for Beginners"
 *               language:
 *                 type: string
 *                 example: "Twi"
 *               description:
 *                 type: string
 *                 example: "An introductory course to the Twi language for non-native speakers."
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: "Beginner"
 *               duration:
 *                 type: string
 *                 example: "4 weeks"
 *               instructor:
 *                 type: string
 *                 example: "Kwame Mensah"
 *               lessons:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Lesson 1: Greetings", "Lesson 2: Numbers"]
 *     responses:
 *       201:
 *         description: Course created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Course created successfully"
 *               data:
 *                 id: "6712a93db243cd82c8b13eab"
 *                 title: "Twi for Beginners"
 *       400:
 *         description: Missing or invalid fields.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid input data"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to create course"
 */
router.post("/create", authenticate, authorizedRoles("Facilitator"), createCourse);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses
 *     description: Retrieves a list of all available courses.
 *     responses:
 *       200:
 *          description: A list of all courses.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 3
 *               data:
 *                 - title: "Twi for Beginners"
 *                   language: "Twi"
 *                 - title: "Ewe for Beginners"
 *                   language: "Ewe"
 *       500:
 *         description: Failed to fetch courses.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to fetch courses"
 */
router.get("/getAllCourses",authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), getAllCourses);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get a course by ID
 *     description: Retrieves details for a single course using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "6712a93db243cd82c8b13eab"
 *                 title: "Ga Language Basics"
 *                 level: "Beginner"
 *       404:
 *         description: Course not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Course not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to fetch course"
 */
router.get("/:id/getOnecourse",authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), getCourseById);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   put:
 *     tags:
 *       - Courses
 *     summary: Update a course
 *     description: Updates details of an existing course by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Twi Course"
 *               duration:
 *                 type: string
 *                 example: "6 weeks"
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Course updated successfully"
 *       404:
 *         description: Course not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Course not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to update course"
 */
router.put("/:id/update",authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), updateCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Delete a course
 *     description: Deletes an existing course by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Course deleted successfully"
 *       404:
 *         description: Course not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Course not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to delete course"
 */
router.delete("/:id/delete",authenticate, authorizedRoles("Facilitator", "Admin"),deleteCourse);

export default router;
