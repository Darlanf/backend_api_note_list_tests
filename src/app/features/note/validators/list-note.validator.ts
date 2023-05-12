import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";

export class ListNoteValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filed } = req.query;

      if (
        filed !== undefined &&
        filed.toString().trim().length > 0 &&
        filed !== "true" &&
        filed !== "false"
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
