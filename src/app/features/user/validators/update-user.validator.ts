import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../repository/user.repository";

export class UpdateUserValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password } = req.body;

      if (
        username !== undefined &&
        username.trim().length <= 0
      ) {
        return RequestError.invalidData(
          res,
          "Username invalido"
        );
      }

      if (
        password !== undefined &&
        password.trim().length <= 0
      ) {
        return RequestError.invalidData(
          res,
          "Password invalido"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
