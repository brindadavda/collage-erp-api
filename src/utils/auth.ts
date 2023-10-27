/* eslint-disable */
import * as fs from 'fs';
import { join } from 'path';
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserModel, I_User } from "../components/user/user.model";
import { findUserByIdAndToken } from '../components/user/user.DAL';
import USER_ERROR_CODES from '../components/user/user.errors';
import HttpException from './error.utils';
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
      return next(
        new HttpException(
          401,
          USER_ERROR_CODES.AUTH_HEADER_NOT_FOUND,
          'UNAUTHENTICATED',
          null,
        ),
      )
    }

    //getting token from header
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(
        new HttpException(
          401,
          USER_ERROR_CODES.USERS_NOT_FOUND,
          'UNAUTHENTICATED',
          null,
        ),
      );
    }

    const privateKey = fs.readFileSync(
      join(__dirname, '../../keys/Private.key'),
    );

    //verify the token
    try {
      const decoded = jwt.verify(
        token,
        privateKey,
      ) as I_User;

      const user = await findUserByIdAndToken(decoded._id , token);

      if (!user) {
        return next(
          new HttpException(
            401,
            USER_ERROR_CODES.UNAUTHENTICATED,
            'UNAUTHENTICATED',
            null,
          ),
        );
      }

      req.user = user;
      req.token = token;
      req.role = decoded as jwt.JwtPayload["role"];

      next();
    } catch (err) {
      return next(
        new HttpException(
          401,
          USER_ERROR_CODES.UNAUTHENTICATED,
          'UNAUTHENTICATED',
          null,
        ),
      );
    }
  };

export default auth;
