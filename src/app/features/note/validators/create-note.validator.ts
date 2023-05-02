import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";

export class CreateNoteValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description } = req.body;

      if (!title) {
        return RequestError.notProvided(
          res,
          "Titulo"
        );
      }

      if (!description) {
        return RequestError.notProvided(
          res,
          "Descriçao"
        );
      }

      if (String(title).trim().length < 3) {
        return RequestError.invalidData(
          res,
          "Titulo precisa ter ao menos 3 caracteres"
        );
      }

      if (String(description).trim().length < 3) {
        return RequestError.invalidData(
          res,
          "Descriçao precisa ter ao menos 3 caracteres"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
