/* eslint-disable */
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserModel, I_User } from "../components/user/user.model";
/**
 * Description placeholder
 * @date 10/23/2023 - 12:33:47 PM
 *
 * @export
 * @interface JwtRequest
 * @typedef {JwtRequest}
 * @extends {Request}
 */
export interface JwtRequest extends Request {
  role?: "ADMIN" | "STAFF" | "STUDENT";
  user?: I_User;
  token?: string;
}

const auth =
  /**
   * Description placeholder
   * @date 10/23/2023 - 12:33:54 PM
   *
   * @async
   * @param {JwtRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {unknown}
   */
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    //auth header null
    if (!authHeader) {
      return res.status(401).json("No authorization header found");
    }

    //getting token from header
    const token = authHeader.split(" ")[1];

    //verify the token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret",
      ) as I_User;

      const user = await UserModel.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });

      if (!user) {
        throw new Error();
      }

      req.user = user;
      req.token = token;
      req.role = decoded as JwtPayload["role"];

      next();
    } catch (err) {
      return res.status(401).json("Invalid token");
    }
  };

export default auth;
