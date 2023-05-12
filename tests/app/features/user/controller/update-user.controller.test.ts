import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { UpdateUserValidator } from "../../../../../src/app/features/user/validators/update-user.validator";
import { User } from "../../../../../src/app/models/user.model";
import { UpdateUserUsecase } from "../../../../../src/app/features/user/usecases/update-user.usecase";

describe("Update user controller test", () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await TypeormConnection.connection
      .getRepository(UserEntity)
      .clear();
  });

  const app = createApp();

  test("deveria retornar erro 400, se o username for menor que 3 caracteres", async () => {
    const res = await request(app)
      .put("/user/:userId")
      .send({
        username: "an",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Username invalido"
    );
  });

  test("deveria retornar erro 400, se o password for menor que 6 caracteres", async () => {
    const res = await request(app)
      .put("/user/:userId")
      .send({
        username: "any_username",
        password: "any_p",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Password invalido"
    );
  });

  test("deveria retornar erro 404, se o o usuario não for encontrado", async () => {
    const newUser = new User(
      "any_username",
      "any_email",
      "any_password"
    );
    const res = await request(app)
      .put(`/user/${newUser.id}`)
      .send({
        username: "any_username",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual(
      "Usuario nao encontrado"
    );
  });

  test("deveria retornar erro 500 se o validator gerar exceção", async () => {
    const updateValidatorSpy = jest
      .spyOn(
        UpdateUserUsecase.prototype,
        "execute"
      )
      .mockImplementation((_: any) => {
        throw new Error(
          "Erro simulado no usecase"
        );
      });

    const newUser = new User(
      "any_username",
      "any_email",
      "any_password"
    );
    const res = await request(app)
      .put(`/user/${newUser.id}`)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
    expect(updateValidatorSpy).toHaveBeenCalled();
    expect(
      updateValidatorSpy
    ).toHaveBeenCalledTimes(1);
  });

  test("deveria retornar sucesso (200) caso o usuario seja editado com sucesso", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const newUser = new User(
      "any_username",
      "any_email",
      "any_password"
    );

    const updatedUser =
      repository.create(newUser);

    await repository.save(updatedUser);

    const res = await request(app)
      .put(`/user/${newUser.id}`)
      .send({
        username: "edited_username",
        password: "edited_pass",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty("body");
    expect(res.body.message).toEqual(
      "Usuario editado com sucesso"
    );
    expect(res.body.data).toBeDefined();
  });
});
