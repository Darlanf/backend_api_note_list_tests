import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../repository/user.repository";

export class CreateUserValidator {
  public static async validate(
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

      if (String(username).trim().length < 3) {
        return RequestError.invalidData(
          res,
          "Username precisa ter ao menos 3 caracteres"
        );
      }

      if (String(email).trim().length < 6) {
        return RequestError.invalidData(
          res,
          "Email invalido"
        );
      }

      if (String(password).trim().length < 6) {
        return RequestError.invalidData(
          res,
          "Password precisa ter ao menos 6 caracteres"
        );
      }

      const user =
        await new UserRepository().getUserByEmail(
          email
        );

      if (user !== null) {
        return RequestError.invalidData(
          res,
          "Email ja cadastrado"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
