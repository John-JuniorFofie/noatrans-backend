import type { Response } from "express";
import type { AuthRequest } from "../types/authRequest";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

  /**
 * @route   GET /api/v1/users/profile
 * @desc    Get profile data of the logged-in user
 * @access  Private (Facilitator, Learner, Admin)
 * */
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized access" });
      return;
    }

    const user = await User.findById(userId).select("password");
    if (!user) {
      res.status(404).json({
         success: false, 
         message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error({ message: "Error fetching user profile", error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// * Update user details (e.g. username, email, password etc.)

// 
/**
 * @route   PUT /api/v1/users/change-email
 * @desc    Change password of logged-in user
 * @access  Private (Facilitator, Learner, Admin)
 */

export const changeEmail = async (req:AuthRequest, res:Response): Promise<void> =>{
  try{
    const userId = req.user?.userId;
    const {oldEmail, newEmail} = req.body;
    //ensure authentication
    if (!userId){
    res.status(401).json({
      success:false,
      message:"Unauthorized acess"
    });
    return;
    }
    //validate input 
    if(!oldEmail || !newEmail){
      res.status(400).json({
        success:false,
        message:"Provide oldEmail and newEmail"
      });return;
    }
    //find user

    const user = await User.findById(userId).select("email");
    if(!user|| user.email){
      res.status(404).json({
        success:false,
        message:"user not found or email not set"
      });
      return;
    }
    //update email
      user.email = newEmail;
      (user as any).passwordChangedAt = new Date(); 
      await user.save();

    res.status(201).json({
      success:true,
      message: "email updated "
    });return;
  } catch (error){
    console.log("error changing password", error);
    res.status(500).json({
      success:false,
      message:"internal server error"
    });

  }
}
// 
// * @route   PUT /api/v1/users/change username
//  * @desc    Change password of logged-in user
//  * @access  Private (Facilitator, Learner, Admin)
//  */ 

export const changeUsername = async (req:AuthRequest, res:Response): Promise<void> =>{
  try{
    const userId = req.user?.userId;
    const {oldUsername, newUsername} = req.body;
    //ensure authentication
    if (!userId){
    res.status(401).json({
      success:false,
      message:"Unauthorized acess"
    });
    return;
    }
    //validate input 
    if(!oldUsername || !newUsername){
      res.status(400).json({
        success:false,
        message:"oldUsername and newUsername"
      });return;
    }
    //find user

    const user = await User.findById(userId).select("fullName");
    if(!user|| user.email){
      res.status(404).json({
        success:false,
        message:"user not found or email not set"
      });
      return;
    }
    //update email
      user.fullName = newUsername;
      (user as any).userNameChangedAt = new Date(); 
      await user.save();

    res.status(201).json({
      success:true,
      message: "userName updated "
    });return;
  } catch (error){
    console.log("error changing userName", error);
    res.status(500).json({
      success:false,
      message:"internal server error"
    });

  }
}
/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change password of logged-in user
 * @access  Private (Facilitator, Learner, Admin)
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { oldPassword, newPassword } = req.body;

    //  Ensure authentication
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized access." });
      return;
    }

    //  Validate input
    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Both old and new passwords are required.",
      });
      return;
    }

    //  Find user and include password
    const user = await User.findById(userId).select("+password");
    if (!user || !user.password) {
      res.status(404).json({
        success: false,
        message: "User not found or password not set.",
      });
      return;
    }

    //  Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });
      return;
    }

    //  Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //  Update password and timestamp
    user.password = hashedPassword;
    (user as any).passwordChangedAt = new Date(); // 👈 safe cast if field optional
    await user.save();

    //  Success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @route   DELETE /api/v1/users/delete
 * @desc    delete user account (mark as deleted)
 * @access  Private (Facilitator, Learner, Admin)
 */
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
   
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized access" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: "User not found" });
      return;
    }

    user.isAccountDeleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error({ message: "Error deleting account", error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};