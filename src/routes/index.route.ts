import express from "express";
import authRouter from "./auth.route.ts";
import userRouter from "./user.route.ts";
import coursesRouter from "./course.route.ts";


const rootRouter = express.Router();


//auth routes
rootRouter.use('/auth',authRouter);

//user routes
rootRouter.use('/users',userRouter);    

//course routes
rootRouter.use('/course',coursesRouter);

export default rootRouter; 