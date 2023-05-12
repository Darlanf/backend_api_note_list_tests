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

  afterEach(() => {
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

  test("deveria retornar sucesso (200) se conseguir listar todas as notas do usuario", async () => {
    jest
      .spyOn(NoteRepository.prototype, "list")
      .mockResolvedValue([note, note, note]);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      title: note.title,
      filed: undefined,
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

  test("deveria converter os valores de filed", async () => {
    const sut = makeSut();

    const isUndefined = sut.isFiled(undefined);
    const isTrue = sut.isFiled("true");
    const isFalse = sut.isFiled("false");
    const isEmpty = sut.isFiled("");

    expect(isUndefined).toBeUndefined();
    expect(isTrue).toBeTruthy();
    expect(isFalse).toBeFalsy();
    expect(isEmpty).toBeUndefined();
  });

  test("deveria retornar os valores de getKey", async () => {
    const sut = makeSut();

    const undefinedKeys = sut.getKey(
      "any_id",
      undefined,
      undefined
    );

    const haveTitle = sut.getKey(
      "any_id",
      "any_title",
      undefined
    );
    const haveFiled = sut.getKey(
      "any_id",
      undefined,
      "true"
    );
    const haveTitleAndFiled = sut.getKey(
      "any_id",
      "any_title",
      "false"
    );

    expect(undefinedKeys).toMatch(
      "listaDeNotas:any_id::"
    );
    expect(haveTitle).toMatch(
      "listaDeNotas:any_id:any_title:"
    );
    expect(haveFiled).toMatch(
      "listaDeNotas:any_id::true"
    );
    expect(haveTitleAndFiled).toMatch(
      "listaDeNotas:any_id:any_title:false"
    );
  });
});
