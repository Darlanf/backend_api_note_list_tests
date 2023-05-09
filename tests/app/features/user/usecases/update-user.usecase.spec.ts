import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UpdateUserUsecase } from "./../../../../../src/app/features/user/usecases/update-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("Update user usecase unit tests", () => {
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
    return new UpdateUserUsecase();
  };

  const user: User = new User(
    "any_name",
    "any_email",
    "any_password"
  );

  test("deveria retornar 404 se não encontrar o usuario buscado", async () => {
    jest
      .spyOn(UserRepository.prototype, "update")
      .mockResolvedValue(0);

    const sut = makeSut();

    const result = await sut.execute({
      userId: "any_id",
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

  test("deveria retornar sucesso (200) se editar o usuario buscado", async () => {
    jest
      .spyOn(UserRepository.prototype, "update")
      .mockResolvedValue(1);

    const sut = makeSut();

    const result = await sut.execute({
      userId: "any_id",
      username: "another_username",
      password: "another_password",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Usuario editado com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data).toEqual("any_id");
  });
});
