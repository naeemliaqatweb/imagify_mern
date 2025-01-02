import express from "express";
import { userRegister, userLogin, userCredit , paymentRazorpay } from "../controllers/userController.js";
import userAuth from "../middleware/auth.js";

const userRouter = express.Router();


userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);
userRouter.get('/credits', userAuth , userCredit);
userRouter.post('/pay-razor', userAuth , paymentRazorpay);

export default userRouter