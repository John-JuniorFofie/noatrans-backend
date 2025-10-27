import express from "express";
import authRouter from "./auth.route.ts";
import userRouter from "./User.route.ts";
// import userRouter from "./user.routes.ts";
// import rideRouter from "./ride.routes.ts";


const rootRouter = express.Router();


//auth routes
rootRouter.use('/auth',authRouter);


//user routes
rootRouter.use('/users',userRouter);





export default rootRouter; 