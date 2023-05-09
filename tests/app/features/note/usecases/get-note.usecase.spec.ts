import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { GetNoteUsecase } from "../../../../../src/app/features/note/usecases/get-note.usecase";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";

describe("GetNote usecase unit test", () => {
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
    return new GetNoteUsecase();
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

  test("deveria retonar erro e codigo 404 quando não encontrar o usuario", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute(
      user.id,
      note.id
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(404);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Usuario nao encontrado"
    );
  });

  test("deveria retonar erro e codigo 404 quando a nota não for encontrada", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(user);

    jest
      .spyOn(
        NoteRepository.prototype,
        "getNoteById"
      )
      .mockResolvedValue(0);

    const sut = makeSut();

    const result = await sut.execute(
      user.id,
      note.id
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(404);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Nota nao encontrada"
    );
  });

  test("deveria retonar sucesso (200) quando a nota for encontrada", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(user);

    jest
      .spyOn(
        NoteRepository.prototype,
        "getNoteById"
      )
      .mockResolvedValue(note);

    const sut = makeSut();

    const result = await sut.execute(
      user.id,
      note.id
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Nota listada com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data.id).toHaveLength(36);
    expect(result.data.id).toMatch(note.id);
  });
});

// export class GetNoteUsecase {
//   public async execute(
//     userId: string,
//     noteId: string
//   ): Promise<Return> {
//     const cacheRepository = new CacheRepository();
//     const cachedNote =
//       await cacheRepository.get<Note>(
//         `Nota:${noteId}`
//       );

//     if (cachedNote !== null) {
//       return {
//         ok: true,
//         code: 200,
//         message:
//           "Nota listada com sucesso - cache",
//         data: cachedNote,
//       };
//     }
//     const userDatabase = new UserRepository();
//     const user = await userDatabase.getUserById(
//       userId
//     );

//     if (user === null) {
//       return {
//         ok: false,
//         code: 404,
//         message: "Usuario nao encontrado",
//       };
//     }

//     const noteDatabase = new NoteRepository();
//     const note = await noteDatabase.getNoteById(
//       noteId
//     );

//     if (note === 0) {
//       return {
//         ok: false,
//         code: 404,
//         message: "Nota nao encontrada",
//       };
//     }
//     await cacheRepository.setEx(
//       `Nota:${noteId}`,
//       note,
//       300
//     );

//     return {
//       ok: true,
//       code: 200,
//       message: "Nota listada com sucesso",
//       data: note,
//     };
//   }
// }
