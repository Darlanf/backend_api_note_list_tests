// import { Note } from "../../../models/note.model";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { User } from "../../../../../src/app/models/user.model";
import { Note } from "../../../../../src/app/models/note.model";

describe("Create note usecase unit test", () => {
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
    return new CreateNoteUsecase();
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

  test("deveria retornar erro e codigo 404 se o usuario não for encontrado", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      userId: "any_id",
      title: "any_title",
      description: "any_description",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(404);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "O usuario não foi encontrado"
    );
  });

  test("deveria retornar sucesso (201) se a nota for criada com sucesso", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(user);

    jest
      .spyOn(NoteRepository.prototype, "create")
      .mockResolvedValue(note);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      title: "any_title",
      description: "any_description",
    });
    console.log(result.data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(201);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Nota criada com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data._id).toMatch(note.id);
  });
});
