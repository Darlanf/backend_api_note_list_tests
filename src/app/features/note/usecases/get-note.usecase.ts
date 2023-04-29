import { Note } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

export class GetNoteUsecase {
  public async execute(
    userId: string,
    noteId: string
  ): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const cachedNote =
      await cacheRepository.get<Note>(
        `Nota:${noteId}`
      );

    if (cachedNote !== null) {
      return {
        ok: true,
        code: 200,
        message:
          "Nota listada com sucesso - cache",
        data: cachedNote,
      };
    }
    const userDatabase = new UserRepository();
    const user = await userDatabase.getUserById(
      userId
    );

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "Usuario nao encontrado",
      };
    }

    const noteDatabase = new NoteRepository();
    const note = await noteDatabase.getNoteById(
      noteId
    );

    if (note === 0) {
      return {
        ok: false,
        code: 404,
        message: "Nota nao encontrada",
      };
    }
    await cacheRepository.setEx(
      `Nota:${noteId}`,
      note,
      300
    );

    return {
      ok: true,
      code: 200,
      message: "Nota listada com sucesso",
      data: note,
    };
  }
}
