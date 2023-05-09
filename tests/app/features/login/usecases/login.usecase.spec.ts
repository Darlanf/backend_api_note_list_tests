import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { LoginUsecase } from "./../../../../../src/app/features/login/usecases/login.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("Login usecase unit tests", () => {
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
    return new LoginUsecase();
  };

  const user: User = new User(
    "any_name",
    "any_email",
    "any_password"
  );

  test("deveria retornar 401 se o email ou senha estiverem incorreto(s)", async () => {
    jest
      .spyOn(UserRepository.prototype, "login")
      .mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeFalsy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(401);
    expect(result).toHaveProperty(
      "message",
      "Email/Senha incorretos"
    );
  });

  test("deveria retornar sucesso (200) se fizer login corretamente", async () => {
    jest
      .spyOn(UserRepository.prototype, "login")
      .mockResolvedValue(user);

    const sut = makeSut();

    const result = await sut.execute({
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty("message");
    expect(result.message).toEqual(
      "Login feito com sucesso"
    );
  });
});
