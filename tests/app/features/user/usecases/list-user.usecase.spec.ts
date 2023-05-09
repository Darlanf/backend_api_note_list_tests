import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { ListUserUsecase } from "./../../../../../src/app/features/user/usecases/list-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("list users usecase unit tests", () => {
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
    return new ListUserUsecase();
  };

  const user: User = new User(
    "any_name",
    "any_email",
    "any_password"
  );

  test("deveria retornar sucesso (200) se encontrar a lista de usuarios", async () => {
    jest
      .spyOn(UserRepository.prototype, "list")
      .mockResolvedValue([user, user, user]);

    const sut = makeSut();

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok");
    expect(result.ok).toBeTruthy();
    expect(result).toHaveProperty("code");
    expect(result.code).toBe(200);
    expect(result).toHaveProperty(
      "message",
      "Usuarios listados com sucesso"
    );
    expect(result).toHaveProperty("data");
    expect(result.data).toHaveLength(3);
  });
});
