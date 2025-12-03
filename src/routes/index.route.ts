import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import coursesRouter from "./course.route";


const rootRouter = express.Router();


//auth routes
rootRouter.use('/auth',authRouter);

//user routes
rootRouter.use('/users',userRouter);    

//course routes
rootRouter.use('/courses',coursesRouter);

export default rootRouter; 