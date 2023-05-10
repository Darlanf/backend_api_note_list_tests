import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Update note usecase unit tests", () => {
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
    return new UpdateNoteUsecase();
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

  test("deveria retornar erro e codigo 404 se nao encontrar o usuario ", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      noteId: note.id,
      title: note.title,
      description: note.description,
      filed: note.filed,
    });

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

  test("deveria retornar sucesso (200) se a nota for editada corretamente ", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(user);

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

    const result = await sut.execute({
      userId: user.id,
      noteId: note.id,
      title: note.title,
      description: note.description,
      filed: note.filed,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Nota editada com sucesso"
    );
  });
});
