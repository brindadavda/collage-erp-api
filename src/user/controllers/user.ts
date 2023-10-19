import { Request, Response } from "express";
import { UserModel } from "../model/user";
import { JwtRequest } from "../middleware/auth";
import bcrypt from 'bcryptjs';

class UserController {

    //creating user
    static async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;

            //if data not getting from req.body
            if (Object.keys(userData).length == 0) {
                return res.send('Please provide user details');
            }

            const findUser = await UserModel.findOne({ email: req.body.email, role: req.body.role });


            if (findUser) {
                return res.status(400).send('User already created');
            }

            // Create a new instance of UserModel
            const user = new UserModel(userData);

            // Save the user to the database
            await user.save();

            res.status(201).send(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }

    //login user
    static async loginUser(req: Request, res: Response) {
        try {
            // Find user by email & role
            const foundUser: any = await UserModel.findOne({ email: req.body.email, role: req.body.role });

            if (!foundUser) {
                return res.send('Email not found Or Role not found');
            }

            //if password no provided
            if (!req.body.password) {
                return res.send('Password not found');
            };

            const isMatch = await bcrypt.compare(req.body.password, foundUser.password);

            if (isMatch) {
                // Generate a JWT token for the user
                const token = await foundUser.generateAuthToken();

                foundUser.tokens = foundUser.tokens.concat({ token });

                await foundUser.save();

                res.status(200).send({ user: foundUser, token });
            } else {
                return res.status(400).send('Invalid password');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
        }
    }

    //logout user
    static async logout(req: JwtRequest, res: Response) {
        console.log('logout')
        try {
            req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

            console.log(req.user);

            await req.user.save();

            res.send('Successfully Logout')
        } catch (e) {
            res.status(500).send(e.toString())
        }
    }

    //logout all token
    static async logoutall(req: JwtRequest, res: Response) {
        try {
            req.user.tokens = [];
            await req.user.save();
            res.status(200).send('Logout All');
        }
        catch (e) {
            res.status(500).send(e.toString());
        }
    }



}


export default UserController;