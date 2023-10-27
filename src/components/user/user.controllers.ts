/* eslint-disable */
import { Request, Response } from "express";
/* eslint-disable */
import { UserModel } from "./user.model";
import { JwtRequest } from "utils/auth";
/* eslint-disable */
import bcrypt from "bcryptjs";

/**
 * Description placeholder
 * @date 10/23/2023 - 12:32:07 PM
 *
 * @class UserController
 * @typedef {UserController}
 */
class UserController {
  //creating user
  /**
   * Description placeholder
   * @date 10/23/2023 - 12:32:18 PM
   *
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {unknown}
   */
  static async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;

      //if data not getting from req.body
      if (Object.keys(userData).length == 0) {
        return res.send("Please provide user details");
      }

      const findUser = await UserModel.findOne({
        email: req.body.email,
        role: req.body.role,
      });

      if (findUser) {
        return res.status(400).send("User already created");
      }

      // Create a new instance of UserModel
      const user = new UserModel(userData);

      // Save the user to the database
      await user.save();

      res.status(201).send(user);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  //login user
  /**
   * Description placeholder
   * @date 10/23/2023 - 12:32:27 PM
   *
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {unknown}
   */
  static async loginUser(req: Request, res: Response) {
    try {
      // Find user by email & role & passsword
      const foundUser = await UserModel.findUser(
        req.body.email,
        req.body.role,
        req.body.password,
      );

      if (!foundUser) {
        return res.send("Email not found Or Role not found");
      }

      //if password no provided
      if (!req.body.password) {
        return res.send("Password not found");
      }

      const isMatch = await bcrypt.compare(
        req.body.password,
        foundUser.password,
      );

      if (isMatch) {
        // Generate a JWT token for the user
        const token = await foundUser.generateAuthToken();

        foundUser.tokens = foundUser.tokens.concat({ token });

        await foundUser.save();

        res.status(200).send({ user: foundUser, token });
      } else {
        return res.status(400).send("Invalid password");
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  //logout user
  /**
   * Description placeholder
   * @date 10/23/2023 - 12:32:43 PM
   *
   * @static
   * @async
   * @param {JwtRequest} req
   * @param {Response} res
   * @returns {*}
   */
  static async logout(req: JwtRequest, res: Response) {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.token,
      );

      console.log(req.user);

      await req.user.save();

      res.send("Successfully Logout");
    } catch (e) {
      res.status(500).send(e.toString());
    }
  }

  //logout all token
  /**
   * Description placeholder
   * @date 10/23/2023 - 12:32:52 PM
   *
   * @static
   * @async
   * @param {JwtRequest} req
   * @param {Response} res
   * @returns {*}
   */
  static async logoutall(req: JwtRequest, res: Response) {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send("Logout All");
    } catch (e) {
      res.status(500).send(e.toString());
    }
  }
}

export default UserController;
