import express from "express";
import {
  createCourse,
  enrollInCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
   
} from "../controllers/course.controller.ts";

import { authenticate } from "../middlewares/auth.middleware.ts";
import { authorizedRoles } from "../middlewares/rbac.middleware.ts";

const router = express.Router();
  
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and enrollment endpoints
 */

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all available courses
 *     tags: [Courses]
 *     description: Fetch all non-deleted and published courses.
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - id: 662f0a8d12adf92b1c33ab1a
 *                   title: "Twi Beginner Course"
 *                   description: "Learn Twi from scratch"
 *                   facilitator: "Kofi Manu"
 *                   price: 0
 *       500:
 *         description: Internal server error
 */
router.get("/",authenticate, authorizedRoles ("Faclilitator, Learner, Admin"), getAllCourses);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get course details
 *     tags: [Courses]
 *     description: Retrieve a single course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 662f0a8d12adf92b1c33ab1a
 *                 title: "Twi Beginner Course"
 *                 description: "Learn Twi step-by-step"
 *                 facilitator: "Kofi Manu"
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get("/:courseId/get",authenticate, authorizedRoles ("Facilitator, Learner, Admin"), getCourseById);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course (Facilitator only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Facilitator creates a new course.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ewe Basic Phrases"
 *               description:
 *                 type: string
 *                 example: "Master common Ewe greetings and expressions."
 *               category:
 *                 type: string
 *                 example: "Languages"
 *               price:
 *                 type: number
 *                 example: 0
 *               durationMinutes:
 *                 type: number
 *                 example: 120
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Course created successfully"
 *               data:
 *                 id: "66ef0c7892adf92b1c33ab1a"
 *                 title: "Ewe Basic Phrases"
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Access denied (only Facilitators can create courses)
 */
router.post("/create", authenticate, authorizedRoles("Facilitator"), createCourse);

/**
 * @swagger
 * /api/v1/courses/{id}/enroll:
 *   post:
 *     summary: Enroll in a course (Learner only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Allows a learner to enroll in a course.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrollment successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Enrollment successful"
 *               data:
 *                 courseId: "66ef0c7892adf92b1c33ab1a"
 *                 userId: "66ef0c7892adf92b1c33ab1b"
 *       400:
 *         description: Already enrolled
 *       403:
 *         description: Only learners can enroll
 */
router.post("/:courseId/enroll", authenticate, authorizedRoles("Learner"), enrollInCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   patch:
 *     summary: Update course details (Facilitator/Admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Facilitators or admins can update course details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *               description:
 *                 type: string
 *                 example: "Learn Twi from beginner to advanced level."
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       403:
 *         description: Forbidden - only facilitator or admin can update
 *       404:
 *         description: Course not found
 */
router.patch("/:courseId/update", authenticate, authorizedRoles("Facilitator", "Admin"), updateCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Delete (soft delete) a course (Facilitator/Admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Facilitators or Admins can delete a course (soft delete).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */
router.delete("/:id/delete", authenticate, authorizedRoles("Facilitator", "Admin"), deleteCourse);


export default router;
