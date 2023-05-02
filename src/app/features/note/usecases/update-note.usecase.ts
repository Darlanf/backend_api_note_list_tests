import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

interface UpdateNoteParams {
  userId: string;
  noteId: string;
  title: string;
  description: string;
  filed: boolean;
}

export class UpdateNoteUsecase {
  public async execute(
    data: UpdateNoteParams
  ): Promise<Return> {
    const userDatabase = new UserRepository();
    const user = await userDatabase.getUserById(
      data.userId
    );

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "Usuario nao encontrado",
      };
    }
    console.log("usecase", typeof data.filed);

    const noteDatabase = new NoteRepository();
    const result = await noteDatabase.update(
      data.noteId,
      data.title,
      data.description,
      data.filed
    );
    console.log("rslt", result);

    await new CacheRepository().delete(
      `Nota:${data.noteId}`
    );
    return {
      ok: true,
      code: 200,
      message: "Nota editada com sucesso",
      data: result,
    };
  }
}
