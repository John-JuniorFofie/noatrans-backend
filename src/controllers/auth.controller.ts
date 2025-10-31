import type{Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.ts';
// import type{CustomJwtPayload} from '../types/authRequest.ts';
import dotenv from "dotenv";

dotenv.config();


//JWT
const { ACCESS_TOKEN_SECRET } = process.env;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in .env');
}


//@route POST /api/v1/auth/register
//@desc Sign Up User (Create User and Hash Password)
//@access Public
export const register = async ( req: Request, res: Response): Promise<void> => {
    try {
        const {
            fullName,
            userName,
            email,
            password,
            role,
         } = req.body;

        //Validation
        if (!fullName || !email || !password|| !role) {
            res.status(400).json({
                success: false,
                message: "Full Name, Email, Password and role are required"
            });
            return
        }

        if(!userName) {
            res.status(400).json({
                success: false,
                message: "Username is required and must be unique"
            });
            return
        }

        if(password.length < 8) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
            return
        }

        //Check for existing username
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists, try logging in."
            });
            return
        }

        //Check for existing user
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     //Restore the user's account if it was deleted
        //     if (existingUser.isAccountDeleted) {
        //         existingUser.isAccountDeleted = false;
        //         await existingUser.save();

        //         res.status(200).json({
        //             success: true,
        //             message: 'Account restored successfully. Please log in.',
        //         });
        //         return;
        //     }
        //     res.status(400).json({
        //         success: false,
        //         message: 'User already exists, try logging in.',
        //     });
        //     return;
        // }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create New User
         await User.create({
            fullName,
            userName,
            email,
            password: hashedPassword,
            role,
            
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (error: unknown) {
        console.log({message: "Error signing up user", error: error});
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return
    }
}


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
        const existingUser = await User.findOne({email}).select('+password');
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

