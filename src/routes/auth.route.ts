import express from "express";
import { register, login } from "../controllers/auth.controllers.ts";
import { authenticate } from "../middlewares/auth.middleware.ts";
import { authorizedRoles } from "../middlewares/rbac.middleware.ts";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user registration, login, and access control
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with a hashed password. If the email already exists and the account was previously deleted, it restores the account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - userName
 *               - studentStatus
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John fofie"
 *               userName:
 *                 type: string
 *                 example: "john_fofie"
 *               studentStatus:
 *                 type: string
 *                 enum: [Student, Graduate, Other]
 *                 example: "Student"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.fofie@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "User registered successfully."
 *               data:
 *                 id: "66ef0c7892adf92b1c33ab1a"
 *                 email: "john.fofie@example.com"
 *                 userName: "john_fofie"
 *       200:
 *         description: Account restored successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Account restored successfully."
 *       400:
 *         description: Missing fields or user already exists.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
router.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates a user using email and password, then returns a JWT access token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.fofie@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful. Returns access token.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: "66ef0c7892adf92b1c33ab1a"
 *                 email: "john.fofie@example.com"
 *                 role: "Rider"
 *       400:
 *         description: Invalid credentials or missing fields.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid email or password"
 *       404:
 *         description: Account not found or deleted.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Account deleted. Please contact support."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get user profile (Protected)
 *     description: Returns the profile of the currently logged-in user. Requires a valid JWT token and an authorized role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Welcome to your dashboard!"
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized access."
 *       403:
 *         description: Forbidden - Role not authorized.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Access denied."
 */
router.get("/profile",authenticate,authorizedRoles("Facilitator", "Learner", "Admin"),
  (req, res) => {
    res.json({ message: "Welcome to your dashboard!" });
  }
);

export default router;