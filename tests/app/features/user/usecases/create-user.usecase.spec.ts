import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { CreateUserUsecase } from "./../../../../../src/app/features/user/usecases/create-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("create user usecase unit tests", () => {
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
    return new CreateUserUsecase();
  };

  const user = {
    username: "any_username",
    password: "any_password",
    email: "any_email",
  };

  test("deveria retornar erro 400 se o username for maior que 30 caracteres ", async () => {
    const sut = makeSut();

    const result = await sut.execute({
      ...user,
      username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code", 400);
    expect(result).toHaveProperty(
      "message",
      "Username pode ter no maximo 30 caracteres"
    );
  });

  test("deveria retornar erro 400 se o password for maior que 12 caracteres ", async () => {
    const sut = makeSut();

    const result = await sut.execute({
      ...user,
      password: "abcdefghijlmn",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code", 400);
    expect(result).toHaveProperty(
      "message",
      "Password pode ter no maximo 12 caracteres"
    );
  });

  test("deveria retornar sucesso (201) se o usuario for criado com sucesso", async () => {
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(
        new User(
          user.username,
          user.email,
          user.password
        )
      );
    const sut = makeSut();

    const result = await sut.execute({
      ...user,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code", 201);
    expect(result).toHaveProperty(
      "message",
      "Usuario criado com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty(
      "data.email",
      user.email
    );
    expect(result).toHaveProperty("data.id");
    expect(result.data.id).toBeDefined();
    expect(result.data.id).toHaveLength(36);
  });
});
