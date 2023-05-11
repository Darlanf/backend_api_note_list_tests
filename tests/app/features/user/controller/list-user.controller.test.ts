import { ListUserUsecase } from "../../../../../src/app/features/user/usecases/list-user.usecase";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("List user controller test", () => {
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

  test("deveria retornar 500 quando o usecase gerar uma exceção", async () => {
    const listUsecaseSpy = jest
      .spyOn(ListUserUsecase.prototype, "execute")
      .mockImplementation(() => {
        throw new Error(
          "Erro simulado no usecase"
        );
      });

    const res = await request(app)
      .get("/user")
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
    expect(listUsecaseSpy).toHaveBeenCalled();
    expect(listUsecaseSpy).toHaveBeenCalledTimes(
      1
    );
  });

  test("deveria retornar sucesso (200) e uma lista de usuarios", async () => {
    const res = await request(app)
      .get("/user")
      .send({});
    console.log(res.body);

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual(
      "Usuarios listados com sucesso"
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeDefined();
  });
});
