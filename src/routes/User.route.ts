import { Router } from "express";

import {
  getUserProfile,
  changeEmail,
  changeUsername,
  changePassword,
  deleteAccount,
} from "../controllers/user.controllers.ts";
import { authenticate } from "../middlewares/auth.middleware.ts";
import { authorizedRoles } from "../middlewares/rbac.middleware.ts";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management and account operations
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get logged-in user profile
 *     description: Fetches the profile details of the currently authenticated user (Driver or Rider).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "User profile fetched successfully."
 *               data:
 *                 _id: "66ef0c7892adf92b1c33ab1a"
 *                 fullName: "John Fofie"
 *                 userName: "john_fofie"
 *                 email: "john.fofie@example.com"
 *                 studentStatus: "Student"
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized access."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "User not found."
 */
router.get("/profile", authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), getUserProfile);

/**
 * @swagger
 * /api/v1/users/change-password:
 *   put:
 *     tags:
 *       - User
 *     summary: Change user password
 *     description: Allows the logged-in user to change their password securely.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePass456!"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Password updated successfully."
 *       400:
 *         description: Invalid credentials or missing fields.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Old password is incorrect."
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized access."
 *       500:
 *         description: Internal server error.
 */
router.put("/change-password", authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), changePassword);

/**
 * @swagger
 * /api/v1/users/change-username:
 *   put:
 *     tags:
 *       - User
 *     summary: Change user username
 *     description: Allows the logged-in user to update their username.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldUsername
 *               - newUsername
 *             properties:
 *               oldUsername:
 *                 type: string
 *                 example: "john_fofie"
 *               newUsername:
 *                 type: string
 *                 example: "johnny_dev"
 *     responses:
 *       201:
 *         description: Username updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Username updated successfully."
 *       400:
 *         description: Missing fields or invalid input.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Both oldUsername and newUsername are required."
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized access."
 *       404:
 *         description: User not found.
 */
router.put("/change-username", authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), changeUsername);
/**
 * @swagger
 * /api/v1/users/change-email:
 *   put:
 *     tags:
 *       - User
 *     summary: Change user email
 *     description: Allows the logged-in user to change their account email address.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldEmail
 *               - newEmail
 *             properties:
 *               oldEmail:
 *                 type: string
 *                 format: email
 *                 example: "john.old@example.com"
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 example: "john.new@example.com"
 *     responses:
 *       201:
 *         description: Email updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Email updated successfully."
 *       400:
 *         description: Missing fields or invalid input.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 */
router.put("/change-email", authenticate, authorizedRoles ("Facilitator", "Learner", "Admin"), changeEmail);


/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user account
 *     description: Soft deletes the user account by marking it as deleted (can be restored later by admin).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Account deleted successfully."
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete", authenticate, authorizedRoles("Facilitator", "Learner", "Admin"), deleteAccount);

export default router;