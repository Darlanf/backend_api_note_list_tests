import { Request, Response } from "express";
import { UserDatabase } from "../../../shared/database/repositories/user.database";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { User } from "../models/user.model";
import { SuccessResponse } from "../../../shared/util/success.response";

export class UserController {
  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const { username, email, password } =
        req.body;

      const database = new UserDatabase();
      const newUser = new User(
        username,
        email,
        password
      );

      const result = await database.create(
        newUser
      );

      return SuccessResponse.created(
        res,
        "User successfully created",
        result.toJson()
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

      const database = new UserDatabase();
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

  public async list(req: Request, res: Response) {
    try {
      const database = new UserDatabase();
      let userList = await database.list();

      const result = userList.map((user) =>
        user.toJson()
      );

      return SuccessResponse.ok(
        res,
        "Users successfully listed",
        result
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

      const database = new UserDatabase();
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

      const database = new UserDatabase();
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

      const database = new UserDatabase();
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
