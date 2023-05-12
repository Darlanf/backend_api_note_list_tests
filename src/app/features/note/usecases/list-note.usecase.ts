import { Note } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { NoteRepository } from "../repository/note.repository";

interface ListNoteParams {
  userId: string;
  title?: string;
  filed?: string;
}

export class ListNoteUsecase {
  public async execute(
    data: ListNoteParams
  ): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const cacheKey = this.getKey(
      data.userId,
      data.title,
      data.filed
    );
    const cachedNoteList =
      await cacheRepository.get<Note[]>(cacheKey);

    if (
      cachedNoteList !== null &&
      cachedNoteList !== undefined
    ) {
      return {
        ok: true,
        code: 200,
        message:
          "Notas listadas com sucesso - cache",
        data: cachedNoteList,
      };
    }

    const filed = this.isFiled(data.filed);

    const database = new NoteRepository();
    let noteList = await database.list(
      data.userId,
      data.title,
      filed
    );

    await cacheRepository.setEx(
      cacheKey,
      noteList,
      300
    );

    return {
      ok: true,
      code: 200,
      message: "Notas listadas com sucesso",
      data: noteList,
    };
  }

  public isFiled(filed: string | undefined) {
    switch (filed) {
      case "":
        return undefined;
      case undefined:
        return undefined;
      case "false":
        return false;
      case "true":
        return true;
      default:
        return;
    }
  }

  public getKey(
    userId: string,
    title?: string,
    filed?: string
  ): string {
    if (
      title !== undefined &&
      (filed === undefined || filed === "")
    ) {
      return `listaDeNotas:${userId}:${title}:`;
    } else if (
      (title === undefined || title === "") &&
      filed !== undefined
    ) {
      return `listaDeNotas:${userId}::${filed}`;
    } else if (
      title !== undefined &&
      filed !== undefined
    ) {
      return `listaDeNotas:${userId}:${title}:${filed}`;
    }
    return `listaDeNotas:${userId}::`;
  }
}
