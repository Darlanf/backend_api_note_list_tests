import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { NoteRepository } from "../repository/note.repository";

export class DeleteNoteUsecase {
  public async execute(
    userId: string,
    noteId: string
  ): Promise<Return> {
    const database = new NoteRepository();
    const result = await database.delete(noteId);

    if (result === 0) {
      return {
        ok: false,
        code: 404,
        message: "Nota não encontrada",
      };
    }
    await new CacheRepository().delete(
      `Notas:${noteId}`
    );
    return {
      ok: true,
      code: 200,
      message: "Nota deletada com sucesso",
      data: noteId,
    };
  }
}
