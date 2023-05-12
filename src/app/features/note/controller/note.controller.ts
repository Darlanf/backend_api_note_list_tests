import { Request, Response } from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { SuccessResponse } from "../../../shared/util/success.response";
import { NoteRepository } from "../repository/note.repository";
import { UserRepository } from "../../user/repository/user.repository";
import { CreateNoteUsecase } from "../usecases/create-note.usecase";
import { ListNoteUsecase } from "../usecases/list-note.usecase";
import { DeleteNoteUsecase } from "../usecases/delete-note.usecase";
import { UpdateNoteUsecase } from "../usecases/update-note.usecase";
import { GetNoteUsecase } from "../usecases/get-note.usecase";

export class NoteController {
  public async listAll(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;
      const title = req.query.title as
        | string
        | undefined;
      const filed = req.query.filed as
        | string
        | undefined;

      const result =
        await new ListNoteUsecase().execute({
          userId,
          title,
          filed,
        });

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
      const { userId, noteId } = req.params;

      const result =
        await new GetNoteUsecase().execute(
          userId,
          noteId
        );

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;
      const { title, description } = req.body;

      const result =
        await new CreateNoteUsecase().execute({
          userId,
          title,
          description,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async delete(
    req: Request,
    res: Response
  ) {
    try {
      const { userId, noteId } = req.params;

      const result =
        await new DeleteNoteUsecase().execute(
          userId,
          noteId
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
      const { userId, noteId } = req.params;
      const { title, description, filed } =
        req.body;

      const result =
        await new UpdateNoteUsecase().execute({
          userId,
          noteId,
          title,
          description,
          filed,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
