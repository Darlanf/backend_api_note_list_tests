import { Request, Response } from "express";
import { UserRepository } from "../../user/repository/user.repository";
import { RequestError } from "../../../shared/errors/request.error";
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

      return SuccessResponse.ok(
        res,
        "Login feito com sucesso",
        result.data.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
