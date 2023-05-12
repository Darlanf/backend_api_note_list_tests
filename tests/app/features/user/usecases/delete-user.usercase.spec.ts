import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { DeleteUserUsecase } from "./../../../../../src/app/features/user/usecases/delete-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("delete user usecase unit tests", () => {
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
    return new DeleteUserUsecase();
  };

  const user = {
    username: "any_username",
    password: "any_password",
    email: "any_email",
  };

  test("deveria retornar 404 se não deletar o usuario", async () => {
    jest
      .spyOn(UserRepository.prototype, "delete")
      .mockResolvedValue(0);
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

  test("deveria retornar sucesso (200) se deletar o usuario", async () => {
    jest
      .spyOn(UserRepository.prototype, "delete")
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

    const result = await sut.execute("any_id");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty(
      "message",
      "Usuario excluido com sucesso"
    );
  });
});
