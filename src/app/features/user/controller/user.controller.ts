import { Request, Response } from "express";
import { UserRepository } from "../../../features/user/repository/user.repository";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { User } from "../../../models/user.model";
import { SuccessResponse } from "../../../shared/util/success.response";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ListUserUsecase } from "../usecases/list-user.usecase";

export class UserController {
  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const { username, email, password } =
        req.body;

      const result =
        await new CreateUserUsecase().execute(
          req.body
        );

      return SuccessResponse.created(
        res,
        "Usuario criado com sucesso",
        result
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const result =
        await new ListUserUsecase().execute();

      const userList: User = result.data.map(
        (user: User) => user.toJson()
      );

      return SuccessResponse.ok(
        res,
        "Usuarios listados com sucesso",
        userList
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async login(
    req: Request,
    res: Response
  ) {
    try {
      const { email, password } = req.body;

      const database = new UserRepository();
      let user = await database.login(
        email,
        password
      );

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      return SuccessResponse.ok(
        res,
        "Login successfully done",
        user?.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async listOne(
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

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User id"
        );
      }

      const database = new UserRepository();
      const result = await database.delete(
        userId
      );

      if (result === 0) {
        return RequestError.notFound(res, "User");
      }

      return SuccessResponse.ok(
        res,
        "User successfully deleted",
        userId
      );
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

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User"
        );
      }
      const data = {
        username,
        password,
      };

      const database = new UserRepository();
      const result = await database.update(
        userId,
        data
      );

      if (result === 0) {
        return RequestError.notFound(res, "user");
      }

      return SuccessResponse.ok(
        res,
        "User successfully update",
        userId
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
