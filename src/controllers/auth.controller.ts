import type{Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
// import type{CustomJwtPayload} from '../types/authRequest.ts';
import dotenv from "dotenv";
import generateOTP from '../utils/OTP';
import OTPVerification from '../models/OTPVerification.model';
import {CustomJwtPayload} from '../types/authRequest';
import {Email} from '../utils/email.transporter';
import { sendEmail } from "../utils/email.resend";


dotenv.config();


//JWT
const { ACCESS_TOKEN_SECRET } = process.env;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in .env');
}


//@route POST /api/v1/auth/register
//@desc Sign Up User (Create User and Hash Password)
//@access Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, surName, userName, email, password } = req.body;

    // VALIDATION
    if (!firstName || !surName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "First name, Surname, Email and Password are required",
      });
      return;
    }

    // if (!userName) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Username is required and must be unique",
    //   });
    //   return;
    // }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    // CHECK EXISTING USERNAME
    const existingUsername = await UserModel.findOne({ firstName, surName });
    if (existingUsername) {
      res.status(400).json({
        success: false,
        message: "Username already exists, choose another one.",
      });
      return;
    }

    // CHECK EXISTING EMAIL
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already exists, try logging in.",
      });
      return;
    }

    // AUTOMATIC ROLE ASSIGNMENT
    let role = "Learner"; // default

    if (email.toLowerCase().endsWith("@noatrans.com")) {
      role = "Admin"; // admin uses business email only
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = await UserModel.create({
      firstName,
      surName,
      userName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser._id,
        fullName: `${newUser.firstName} ${newUser.surName}`,
        // userName: newUser.userName,
        email: newUser.email,
        // role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//@route POST /api/v1/auth/login
//@desc Login User (JWT authentication with access token)
//@access Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        //Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return
        }

        //Check for existing user
        const existingUser = await UserModel.findOne({email}).select('+password');
        if (!existingUser) {
            res.status(400).json({
                success: false,
                message: "User not found, Please sign up"
            });
            return
        }

        if (existingUser.isAccountDeleted) {
            res.status(404).json({
                success: false,
                message: "Account has been deleted, please sign up again.",
            });
            return;
        }

        //Check Password
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return
        }

        //Create JWT Token
        const accessToken = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        }, ACCESS_TOKEN_SECRET as string, {expiresIn: '1h'});

        //Remove password before sending a response
        const userWithoutPassword = existingUser.toObject() as any;
        delete userWithoutPassword.password;

        res.status(200).json({
            success: true,             
            message: "User logged in successfully",
            accessToken,
            data: userWithoutPassword
        });

    } catch (error: unknown) {
        console.log({message: "Error logging in user", error: error});
        res.status(500).json({
            success: false, 
            error: "Internal Server Error"});
        return
    }
}
//@route POST /api/v1/auth/forgot-password
//@desc reset password when not logged in
//@access public
//Flow: Submit Email -> verify email exists -> Generate secure, time-limited OTP to user email -> Copy & Verify OTP Code in app -> Enter new password -> Backend verifies OTP and updates password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email} = req.body;
        if (!email){
            res.status(400).json({ success: false, message: 'Email is required to reset your password' });
            return;
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(200).json({ success: true, message: 'OTP sent if user exists' });
            return;
        }

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        //Save OTP to the database
        await new OTPVerification({
            userId: user._id,
            email: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000,
        }).save();

        //Email HTML content
        const emailText =
` Hello ${user.firstName},
 You have requested to reset your password.
 Use the OTP below to proceed:
 OTP: ${otp}
        
 ------------------------
        
 Note: This OTP will expire in 10 minutes.
 If you did not request this, please ignore this email or contact support.
        
 Best Regards,  
 AAOBA Support Team`;

        await Email({
            email: user.email,
            subject: "Password Reset OTP",
            text: emailText,
        });

        res.status(200).json({
            success: true,
            message: "A password reset OTP has been sent to your email. Please check your inbox."
        });


    } catch (error: unknown) {
        console.log({message: "Error sending reset OTP:", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"});
        return
    }
}

//Controller for verifying OTP
//POST /api/v1/auth/otp/verify
//@public
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp } = req.body;
        if (!otp) {
            res.status(400).json({ success: false, message: 'OTP is required' });
            return;
        }

        const otpRecord = await OTPVerification.findOne({otp: { $exists: true} });
        if (!otpRecord) {
            res.status(400).json({ success: false, message: 'OTP not found or already used'});
            return;
        }

        if (otpRecord.expiresAt.getTime() < Date.now()) {
            await OTPVerification.deleteMany({ userId: otpRecord.userId });
            res.status(400).json({ success:false, message: "OTP has expired. Request a new one." });
            return;
        }

        const user = await UserModel.findById(otpRecord.userId);
        if (!user) {
            res.status(400).json({ success: false, message: 'User not found' });
            return;
        }

        const validOtp = await bcrypt.compare(otp, otpRecord.otp);
        if (!validOtp) {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
            return;
        }

        // OTP is valid, then generate a temporary token
        const tempToken = jwt.sign({
            userId: user._id,
        }, ACCESS_TOKEN_SECRET as string, {expiresIn: '10m'});

        // const tempToken = generateToken(user._id, "reset-password", "10m");

        await OTPVerification.deleteMany({userId: user._id})

        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password.",
            tempToken
        });

    }catch (error: unknown) {
        console.log({message: "Error verifying OTP:", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"});
        return
    }
}

//Controller for resetting password
//PUT /api/v1/auth/otp/reset
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization;

        if (!newPassword || newPassword.length < 8) {
            res.status(400).json({ success: false, message: 'New Password is required and must be at least 8 characters' });
            return;
        }
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Unauthorized request. Please verify OTP first.' });
            return;
        }

        //Extract tempToken from the Authorization header
        const tempToken = authHeader.split(" ")[1];

        // const decodedToken = jwt.verify(tempToken, ACCESS_TOKEN_SECRET);
        // const decoded = decodedToken as unknown as CustomJwtPayload;
        let decoded: CustomJwtPayload;

        try {
            decoded = jwt.verify(tempToken, ACCESS_TOKEN_SECRET) as CustomJwtPayload;
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                res.status(401).json({
                    success: false,
                    message: "Reset token has expired. Please request a new OTP.",
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: "Invalid reset token.",
            });
            return;
        }

        if (!decoded || !decoded.userId) {
            res.status(400).json({ error: "Invalid or expired reset password token" });
            return;
        }

        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.passwordChangedAt = new Date(Date.now());
        await user.save();

        //Send confirmation email
        const emailText =
 ` Hello ${user.firstName},
Your password has been successfully changed.
If you did not perform this action, please contact our support team immediately.
    
Best Regards, 
AAOBA Support Team`;

        await sendEmail({
            email: user.email,
            subject: "Password Changed Successfully",
            text: emailText,
        });

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in with your new password.",
        })


    }catch (error: unknown) {
        console.log({message: "Error resetting password:", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"});
        return
    }
}
