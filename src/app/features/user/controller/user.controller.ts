import { Request, Response } from "express";
import { UserRepository } from "../../../features/user/repository/user.repository";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { User } from "../../../models/user.model";
import { SuccessResponse } from "../../../shared/util/success.response";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { DeleteUserUsecase } from "../usecases/delete-user.usecase";
import { UpdateUserUsecase } from "../usecases/update-user.usecase";

export class UserController {
  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const { username, email, password } =
        req.body;

      const result =
        await new CreateUserUsecase().execute({
          username,
          email,
          password,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const result =
        await new ListUserUsecase().execute();

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async getOne(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;

      const database = new UserRepository();
      const user = await database.getUserById(
        userId
      );

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      return SuccessResponse.ok(
        res,
        "User successfully obtained",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async delete(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;

      const result =
        await new DeleteUserUsecase().execute(
          userId
        );

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async update(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;
      const { username, password } = req.body;

      const result =
        await new UpdateUserUsecase().execute({
          userId,
          username,
          password,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
