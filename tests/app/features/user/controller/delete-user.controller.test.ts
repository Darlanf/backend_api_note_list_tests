import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { User } from "../../../../../src/app/models/user.model";
import { DeleteUserUsecase } from "../../../../../src/app/features/user/usecases/delete-user.usecase";

describe("Delete user controller test", () => {
  beforeAll(async () => {
    await TypeormConnection.init();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await TypeormConnection.connection
      .getRepository(UserEntity)
      .clear();
  });

  const app = createApp();

  test("deveria retornar 404 se o usuario não for encontrado ", async () => {
    const newUser = new User(
      "any_username",
      "any_email",
      "any_password"
    );
    const res = await request(app)
      .delete(`/user/${newUser.id}`)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual(
      "Usuario nao encontrado"
    );
  });

  test("deveria retornar erro 500 se o usecase gerar exceção", async () => {
    const deleteUsecaseSpy = jest
      .spyOn(
        DeleteUserUsecase.prototype,
        "execute"
      )
      .mockImplementation((_: string) => {
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
      .delete(`/user/${newUser.id}`)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
    expect(deleteUsecaseSpy).toHaveBeenCalled();
    expect(
      deleteUsecaseSpy
    ).toHaveBeenCalledTimes(1);
  });

  test("deveria retornar sucesso (200) caso o usuario seja deletado com sucesso", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const newUser = new User(
      "any_username",
      "any_email",
      "any_password"
    );

    const deletedUser =
      repository.create(newUser);

    await repository.save(deletedUser);

    const res = await request(app)
      .delete(`/user/${newUser.id}`)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty("body");
    expect(res.body.message).toEqual(
      "Usuario excluido com sucesso"
    );
    expect(res.body.data).toBeDefined();
  });
});
