import {
  NextFunction,
  Request,
  Response,
} from "express";
import { UserDatabase } from "../app/shared/database/repositories/user.database";
import { ServerError } from "../app/shared/errors/generic.error";
import { RequestError } from "../app/shared/errors/request.error";
import { NoteDatabase } from "../app/shared/database/repositories/note.database";

export class NoteValidatorMiddleware {
  public static userExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User"
        );
      }

      // const database = new UserDatabase();
      // const user = database.getUserId(userId);

      // if (!user) {
      //   return RequestError.notFound(res, "User");
      // }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static async userAndNoteExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, noteId } = req.params;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "user"
        );
      }

      if (!noteId) {
        return RequestError.notProvided(
          res,
          "Note"
        );
      }

      const userDatabase = new UserDatabase();
      const user = await userDatabase.getUserById(
        userId
      );

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const noteDatabase = new NoteDatabase();
      const note = await noteDatabase.getNoteById(
        noteId
      );

      if (!note) {
        return RequestError.notFound(res, "Note");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static mandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description } = req.body;

      if (!title) {
        return RequestError.notProvided(
          res,
          "Title"
        );
      }

      if (!description) {
        return RequestError.notProvided(
          res,
          "Description"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
