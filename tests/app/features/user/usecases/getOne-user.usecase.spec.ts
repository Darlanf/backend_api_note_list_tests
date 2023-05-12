import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { GetOneUserUsecase } from "./../../../../../src/app/features/user/usecases/getOne-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("GetOne user usecase unit tests", () => {
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
    return new GetOneUserUsecase();
  };

  const user: User = new User(
    "any_name",
    "any_email",
    "any_password"
  );

  test("deveria retornar 404 se não encontrar o usuario buscado", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute("any_id");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(404);
    expect(result).toHaveProperty(
      "message",
      "Usuario nao encontrado"
    );
  });

  test("deveria retornar sucesso (200) se encontrar o usuario buscado", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(user);

    const sut = makeSut();

    const result = await sut.execute("any_id");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Usuario encontrado"
    );
  });
});
