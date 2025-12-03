import type {Request, Response, NextFunction} from "express";

//Role based controles//  Learner, Facilitator and Admin

interface AuthRequest extends Request {
  user?: {role: String};
}

export const authorizedRoles = (...roles: string[])=>{
  return (req: AuthRequest, res: Response, next:NextFunction):void=>{
    const role = req.user?.role
    if(!req.user){
      res.status(401).json({
        success:false,
        message:"unauthorized:  No user role found. please login",
      });
    }
    if (!role){
      res.status(401).json({
        success:false,
        message:"Unauthorized: No user role found. Access denied.",
      });
      return;
    }
    if (!roles){
      res.status(403).json({
        success:false,
        message:"Forbidded: You are not allowed to acccess this resource "
      });
      return;
    }
    next();
  }
}