import { Note } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

interface CreateNoteParams {
  userId: string;
  title: string;
  description: string;
}

export class CreateNoteUsecase {
  public async execute(
    data: CreateNoteParams
  ): Promise<Return> {
    const userDatabase = new UserRepository();
    const user = await userDatabase.getUserById(
      data.userId
    );

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "O usuario não foi encontrado",
      };
    }

    const note = new Note(
      data.title,
      data.description
    );

    const noteDatabase = new NoteRepository();
    const result = await noteDatabase.create(
      data.userId,
      note
    );

    await new CacheRepository().delete(
      `listaDeNotas:${data.userId}`
    );

    return {
      ok: true,
      code: 201,
      message: "Nota criada com sucesso",
      data: result,
    };
  }
}
