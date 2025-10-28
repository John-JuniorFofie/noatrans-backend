import express from "express";
import authRouter from "./auth.route.ts";
import userRouter from "./User.route.ts";
import coursesRouter from "./courses.route.ts";


const rootRouter = express.Router();


//auth routes
rootRouter.use('/auth',authRouter);


//user routes
rootRouter.use('/users',userRouter);    

//course routes
 rootRouter.use('/courses',coursesRouter);





export default rootRouter; 