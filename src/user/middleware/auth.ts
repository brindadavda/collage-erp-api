import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {  I_User, UserModel } from "../model/user";

export interface JwtRequest extends Request {
    role?: 'ADMIN' | 'STAFF' | 'STUDENT';
    user? : I_User,
    token? : string
};

const auth = async (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    //auth header null
    if (!authHeader) {
        return res.status(401).json('No authorization header found');
    }

    //getting token from header
    const token = authHeader.split(' ')[1];

    console.log(token);
    
    //verify the token 
    try {
        const decoded : any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        const user = await UserModel.findOne({ _id: decoded._id , "tokens.token": token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        req.role = decoded as JwtRequest['role'];

        next();
    } catch (err) {
        return res.status(401).json('Invalid token');
    }
};

export default auth;


