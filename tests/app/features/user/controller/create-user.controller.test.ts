import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import request from "supertest";
import { createApp } from "./../../../../../src/main/config/express.config";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("Create user controller test", () => {
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

  test("deveria retornar erro 400 se o username não for informado", async () => {
    const res = await request(app)
      .post("/user")
      .send({});

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Username nao informado"
    );
  });

  test("deveria retornar erro 400 se o email não for informado", async () => {
    const res = await request(app)
      .post("/user")
      .send({ username: "any_username" });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Email nao informado"
    );
  });

  test("deveria retornar erro 400 se o password não for informado", async () => {
    const res = await request(app)
      .post("/user")
      .send({
        username: "any_username",
        email: "any_email",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Password nao informado"
    );
  });

  test("deveria retornar erro 400 se o username tiver menos que 3 caracteres", async () => {
    const res = await request(app)
      .post("/user")
      .send({
        username: "an",
        email: "any_email",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Username precisa ter ao menos 3 caracteres"
    );
  });

  test("deveria retornar erro 400 se o email tiver menos que 6 caracteres", async () => {
    const res = await request(app)
      .post("/user")
      .send({
        username: "any_name",
        email: "any_e",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Email invalido"
    );
  });

  test("deveria retornar erro 400 se o password tiver menos que 6 caracteres", async () => {
    const res = await request(app)
      .post("/user")
      .send({
        username: "any_username",
        email: "any_email",
        password: "any_p",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Password precisa ter ao menos 6 caracteres"
    );
  });

  test("deveria retornar erro 400 se o email ja estiver cadastrado", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const user = repository.create({
      email: "email_ja_cadastrado",
      id: "any_id",
      password: "any_password",
      username: "any_username",
    });

    await repository.save(user);

    const res = await request(app)
      .post("/user")
      .send({
        username: "any_username",
        email: "email_ja_cadastrado",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Email ja cadastrado"
    );
  });

  test("deveria retornar erro 500 se a validação do email gerar exceção", async () => {
    const userRepositorySpy = jest
      .spyOn(
        UserRepository.prototype,
        "getUserByEmail"
      )
      .mockImplementation((_: string) => {
        throw new Error(
          "Erro simulado no validator"
        );
      });
    const res = await request(app)
      .post("/user")
      .send({
        username: "any_username",
        email: "any_email",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no validator"
    );
    expect(userRepositorySpy).toHaveBeenCalled();
    expect(
      userRepositorySpy
    ).toHaveBeenCalledWith("any_email");
    expect(
      userRepositorySpy
    ).toHaveBeenCalledTimes(1);
  });

  test("deveria retornar 201 quando o usuario for criado com sucesso", async () => {
    const res = await request(app)
      .post("/user")
      .send({
        username: "any_name",
        email: "any_email",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toEqual(
      "Usuario criado com sucesso"
    );
  });

  test("deveria retornar 500 quando usecase gerar uma exceção", async () => {
    jest
      .spyOn(
        UserRepository.prototype,
        "getUserByEmail"
      )
      .mockResolvedValue(null);

    const createUsecaseSpy = jest
      .spyOn(
        CreateUserUsecase.prototype,
        "execute"
      )
      .mockImplementation((_: any) => {
        throw new Error(
          "Erro simulado no usecase"
        );
      });

    const res = await request(app)
      .post("/user")
      .send({
        username: "any_name",
        email: "any_email",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
    expect(createUsecaseSpy).toHaveBeenCalled();
    expect(createUsecaseSpy).toHaveBeenCalledWith(
      {
        email: "any_email",
        password: "any_password",
        username: "any_name",
      }
    );
    expect(
      createUsecaseSpy
    ).toHaveBeenCalledTimes(1);
  });
});
