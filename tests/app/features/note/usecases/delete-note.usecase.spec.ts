import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { DeleteNoteUsecase } from "../../../../../src/app/features/note/usecases/delete-note.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("delete note usecase unit tests", () => {
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
    return new DeleteNoteUsecase();
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

  test("deveria retornar erro e codigo 404 se a nota não for encontrada", async () => {
    jest
      .spyOn(NoteRepository.prototype, "delete")
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
      "Nota não encontrada"
    );
  });

  test("deveria retornar sucesso (200) se a nota for deletada", async () => {
    jest
      .spyOn(NoteRepository.prototype, "delete")
      .mockResolvedValue(1);

    jest
      .spyOn(
        CacheRepository.prototype,
        "listByKeys"
      )
      .mockResolvedValue(["any-key"]);

    jest
      .spyOn(CacheRepository.prototype, "delete")
      .mockResolvedValue();

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
      "Nota deletada com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data).toMatch(note.id);
  });
});
