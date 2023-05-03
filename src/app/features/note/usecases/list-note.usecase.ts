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
    const cachedNoteList = await this.getCache(
      data.userId,
      data.title,
      data.filed
    );

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
      data.title ? String(data.title) : undefined,
      filed
    );

    await this.saveCache(
      data.userId,
      noteList,
      data.title,
      data.filed
    );

    return {
      ok: true,
      code: 200,
      message: "Notas listadas com sucesso",
      data: noteList,
    };
  }

  private isFiled(filed: string) {
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

  private async saveCache(
    userId: string,
    noteList: Note[],
    title?: any,
    filed?: any
  ) {
    const cacheRepository = new CacheRepository();

    if (
      (title === undefined || title === "") &&
      (filed === undefined || filed === "")
    ) {
      await cacheRepository.setEx(
        `listaDeNotas:${userId}::`,
        noteList,
        300
      );
    } else if (
      title !== undefined &&
      (filed === undefined || filed === "")
    ) {
      await cacheRepository.setEx(
        `listaDeNotas:${userId}:${title}:`,
        noteList,
        300
      );
    } else if (
      (title === undefined || title === "") &&
      filed !== undefined
    ) {
      await cacheRepository.setEx(
        `listaDeNotas:${userId}::${filed}`,
        noteList,
        300
      );
    } else if (
      title !== undefined &&
      filed !== undefined
    ) {
      await cacheRepository.setEx(
        `listaDeNotas:${userId}:${title}:${filed}`,
        noteList,
        300
      );
    }
  }

  private async getCache(
    userId: string,
    title?: any,
    filed?: any
  ) {
    const cacheRepository = new CacheRepository();
    let cachedNoteList;

    if (
      (title === undefined || title === "") &&
      (filed === undefined || filed === "")
    ) {
      cachedNoteList = await cacheRepository.get<
        Note[]
      >(`listaDeNotas:${userId}::`);
    } else if (
      title !== undefined &&
      (filed === undefined || filed === "")
    ) {
      cachedNoteList = await cacheRepository.get<
        Note[]
      >(`listaDeNotas:${userId}:${title}:`);
    } else if (
      (title === undefined || title === "") &&
      filed !== undefined
    ) {
      cachedNoteList = await cacheRepository.get<
        Note[]
      >(`listaDeNotas:${userId}::${filed}`);
    } else if (
      title !== undefined &&
      filed !== undefined
    ) {
      cachedNoteList = await cacheRepository.get<
        Note[]
      >(
        `listaDeNotas:${userId}:${title}:${filed}`
      );
    }
    return cachedNoteList;
  }
}
