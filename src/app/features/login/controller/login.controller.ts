import { Request, Response } from "express";
import { SuccessResponse } from "../../../shared/util/success.response";
import { ServerError } from "../../../shared/errors/generic.error";
import { LoginUsecase } from "../usecases/login.usecase";

export class LoginController {
  public async login(
    req: Request,
    res: Response
  ) {
    try {
      const { email, password } = req.body;

      const result =
        await new LoginUsecase().execute({
          email,
          password,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
