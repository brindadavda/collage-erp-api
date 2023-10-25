/* eslint-disable */
import { Request, Response, Router } from "express";
import auth from "../utils/auth";
import { JwtRequest } from "../utils/auth";
import UserController from "./user.controllers";
import { logger } from "utils/log";

export const userRouter: Router = Router();

//testing purpose
userRouter.get("", (req: Request, res: Response) => {
  
  res.send("User router is working");
});

//create user
userRouter.post("/create", UserController.createUser);

//login user
userRouter.post("/login", UserController.loginUser);

//logout user
userRouter.post("/logout", auth, UserController.logout);

//logout all token
userRouter.post("/logoutall", auth, UserController.logoutall);

//getting user data
userRouter.get("/me", auth, async (req: JwtRequest, res: Response) => {
  res.send(req.user);
});
