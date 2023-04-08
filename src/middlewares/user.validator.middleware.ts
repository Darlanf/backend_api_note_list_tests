import {
  NextFunction,
  Request,
  Response,
} from "express";
import { UserDatabase } from "../database/repositories/user.database";
import { ServerError } from "../errors/generic.error";
import { RequestError } from "../errors/request.error";

export class UserValidatorMiddleware {
  public static mandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, email, password } =
        req.body;

      if (!username) {
        return RequestError.notProvided(
          res,
          "Username"
        );
      }

      if (!email) {
        return RequestError.notProvided(
          res,
          "Email"
        );
      }

      if (!password) {
        return RequestError.notProvided(
          res,
          "Password"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static emailAlreadyExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const { email } = req.body;
      // const database = new UserDatabase();
      // const userEmail =
      //   database.getUserEmail(email);

      // if (userEmail) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "Email already exist",
      //   });
      // }
      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static isLoginValid(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return RequestError.notProvided(
          res,
          "Email"
        );
      }

      if (!password) {
        return RequestError.notProvided(
          res,
          "Password"
        );
      }

      // const database = new UserDatabase();
      // let user = database.getUserEmail(email);

      // if (!user) {
      //   return RequestError.unauthorized(res);
      // }

      // if (user.password !== password) {
      //   return RequestError.forbidden(res);
      // }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
