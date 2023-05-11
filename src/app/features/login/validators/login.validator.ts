import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../../user/repository/user.repository";

export class LoginValidator {
  public static async validate(
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

      const user =
        await new UserRepository().getUserByEmail(
          email
        );

      if (user === null) {
        return RequestError.invalidData(
          res,
          "Email incorreto ou não cadastrado"
        );
      }
      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
