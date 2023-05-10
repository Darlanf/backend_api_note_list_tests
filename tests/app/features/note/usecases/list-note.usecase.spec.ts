import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { ListNoteUsecase } from "../../../../../src/app/features/note/usecases/list-note.usecase";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import expect from "expect";

describe("list notes usecase unit tests", () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new ListNoteUsecase();
  };

  const user: User = new User(
    "any_name",
    "any_email",
    "any_password"
  );

  const note: Note = new Note(
    "any_title",
    "any_description"
  );

  test("deveria retornar sucesso (200) se conseguir listar as notas do usuario", async () => {
    jest
      .spyOn(NoteRepository.prototype, "list")
      .mockResolvedValue([note, note, note]);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      title: note.title,
      filed: note.filed,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Notas listadas com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data).toHaveLength(3);
  });
});

// interface ListNoteParams {
//   userId: string;
//   title?: any;
//   filed?: any;
// }

// class ListNoteUsecase {
//   public async execute(
//     data: ListNoteParams
//   ): Promise<Return> {
//     const cachedNoteList = await this.getCache(
//       data.userId,
//       data.title,
//       data.filed
//     );

//     if (
//       cachedNoteList !== null &&
//       cachedNoteList !== undefined
//     ) {
//       return {
//         ok: true,
//         code: 200,
//         message:
//           "Notas listadas com sucesso - cache",
//         data: cachedNoteList,
//       };
//     }

//     const filed = this.isFiled(data.filed);

//     const database = new NoteRepository();
//     let noteList = await database.list(
//       data.userId,
//       data.title ? String(data.title) : undefined,
//       filed
//     );

//     await this.saveCache(
//       data.userId,
//       noteList,
//       data.title,
//       data.filed
//     );

//     return {
//       ok: true,
//       code: 200,
//       message: "Notas listadas com sucesso",
//       data: noteList,
//     };
//   }

//   private isFiled(filed: string) {
//     switch (filed) {
//       case "":
//         return undefined;
//       case undefined:
//         return undefined;
//       case "false":
//         return false;
//       case "true":
//         return true;
//       default:
//         return;
//     }
//   }

//   private async saveCache(
//     userId: string,
//     noteList: Note[],
//     title?: any,
//     filed?: any
//   ) {
//     const cacheRepository = new CacheRepository();

//     if (
//       (title === undefined || title === "") &&
//       (filed === undefined || filed === "")
//     ) {
//       await cacheRepository.setEx(
//         `listaDeNotas:${userId}::`,
//         noteList,
//         300
//       );
//     } else if (
//       title !== undefined &&
//       (filed === undefined || filed === "")
//     ) {
//       await cacheRepository.setEx(
//         `listaDeNotas:${userId}:${title}:`,
//         noteList,
//         300
//       );
//     } else if (
//       (title === undefined || title === "") &&
//       filed !== undefined
//     ) {
//       await cacheRepository.setEx(
//         `listaDeNotas:${userId}::${filed}`,
//         noteList,
//         300
//       );
//     } else if (
//       title !== undefined &&
//       filed !== undefined
//     ) {
//       await cacheRepository.setEx(
//         `listaDeNotas:${userId}:${title}:${filed}`,
//         noteList,
//         300
//       );
//     }
//   }

//   private async getCache(
//     userId: string,
//     title?: any,
//     filed?: any
//   ) {
//     const cacheRepository = new CacheRepository();
//     let cachedNoteList;

//     if (
//       (title === undefined || title === "") &&
//       (filed === undefined || filed === "")
//     ) {
//       cachedNoteList = await cacheRepository.get<
//         Note[]
//       >(`listaDeNotas:${userId}::`);
//     } else if (
//       title !== undefined &&
//       (filed === undefined || filed === "")
//     ) {
//       cachedNoteList = await cacheRepository.get<
//         Note[]
//       >(`listaDeNotas:${userId}:${title}:`);
//     } else if (
//       (title === undefined || title === "") &&
//       filed !== undefined
//     ) {
//       cachedNoteList = await cacheRepository.get<
//         Note[]
//       >(`listaDeNotas:${userId}::${filed}`);
//     } else if (
//       title !== undefined &&
//       filed !== undefined
//     ) {
//       cachedNoteList = await cacheRepository.get<
//         Note[]
//       >(
//         `listaDeNotas:${userId}:${title}:${filed}`
//       );
//     }
//     return cachedNoteList;
//   }
// }
