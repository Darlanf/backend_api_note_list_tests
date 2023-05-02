import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";

export class UpdateNoteValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description, filed } =
        req.body;

      if (
        title !== undefined &&
        String(title).trim().length < 3
      ) {
        return RequestError.invalidData(
          res,
          "Titulo precisa ter ao menos 3 caracteres"
        );
      }

      if (
        description !== undefined &&
        String(description).trim().length < 6
      ) {
        return RequestError.notProvided(
          res,
          "Descriçao precisa ter ao menos 6 caracteres"
        );
      }

      if (
        filed !== undefined &&
        filed.toString().trim().length > 0 &&
        filed !== true &&
        filed !== false
      ) {
        return RequestError.invalidData(
          res,
          "Preencha o campo arquivada corretamente"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
