import { Note } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { NoteRepository } from "../repository/note.repository";

interface ListNoteParams {
  userId: string;
  title?: any;
  filed?: any;
}

export class ListNoteUsecase {
  public async execute(
    data: ListNoteParams
  ): Promise<Return> {
    const cacheRepository = new CacheRepository();
    let cachedNoteList =
      await cacheRepository.get<Note[]>(
        `listaDeNotas:${data.userId}:${data.title}:${data.filed}`
      );

    if (cachedNoteList !== null) {
      return {
        ok: true,
        code: 200,
        message:
          "Usuarios listados com sucesso - cache",
        data: cachedNoteList,
      };
    }
    const database = new NoteRepository();
    let noteList = await database.list(
      data.userId,
      data.title ? String(data.title) : undefined
    );

    let isFiled: any = undefined;

    if (
      data.filed !== undefined &&
      data.filed !== ""
    ) {
      isFiled =
        data.filed?.toString().toLowerCase() ===
        "true";
      noteList = noteList.filter(
        (note: any) => note.filed === isFiled
      );
    }
    await cacheRepository.set(
      `listaDeNotas:${data.userId}:${data.title}:${data.filed}`,
      noteList
    );

    return {
      ok: true,
      code: 200,
      message: "Notas listadas com sucesso",
      data: noteList,
    };
  }
}
