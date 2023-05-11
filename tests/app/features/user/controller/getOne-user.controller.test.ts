import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { GetOneUserUsecase } from "../../../../../src/app/features/user/usecases/getOne-user.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";

describe("GetOne user controller test", () => {
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

  const app = createApp();

  const user: User = new User(
    "any_username",
    "any_email",
    "any_password"
  );

  test("deveria retornar erro 500 quando o usecase gerar exceção", async () => {
    const getOneUsecaseSpy = jest
      .spyOn(
        GetOneUserUsecase.prototype,
        "execute"
      )
      .mockImplementation(async (_: string) => {
        throw new Error(
          "Erro simulado no usecase"
        );
      });

    const res = await request(app)
      .get("/user/:userId")
      .send({});
    console.log(res.body);

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
    expect(getOneUsecaseSpy).toHaveBeenCalled();
    expect(
      getOneUsecaseSpy
    ).toHaveBeenCalledTimes(1);
  });

  test("deveria retornar sucesso (200) caso o usuario seja encontrado", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserById"
      )
      .mockResolvedValue(user);

    const userId = user.id;

    const res = await request(app)
      .get(`/user/${userId}`)
      .send({});
    console.log(res.body);

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty("body");
    expect(res.body.message).toEqual(
      "Usuario encontrado"
    );
    expect(res.body.data).toBeDefined();
  });
});
