import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { LoginUsecase } from "../../../../../src/app/features/login/usecases/login.usecase";

describe("Login controller tests", () => {
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

  test("deveria retornar erro 400 se o email não for informado", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({});

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
      .post("/user/login")
      .send({ email: "any_email" });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Password nao informado"
    );
  });

  test("deveria retornar erro 400 se o email estiver errado ou usuario não tiver cadastro", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const logged = repository.create({
      email: "any_email",
      id: "any_id",
      password: "any_password",
      username: "any_username",
    });

    await repository.save(logged);

    const res = await request(app)
      .post("/user/login")
      .send({
        email:
          "Email incorreto ou não cadastrado",
        password: "any_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Email incorreto ou não cadastrado"
    );
  });

  test("deveria retornar erro 500 se a validação do email no validator gerar exceção", async () => {
    const emailRepositorySpy = jest
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
      .post("/user/login")
      .send({
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
    expect(emailRepositorySpy).toHaveBeenCalled();
    expect(
      emailRepositorySpy
    ).toHaveBeenCalledWith("any_email");
    expect(
      emailRepositorySpy
    ).toHaveBeenCalledTimes(1);
  });

  test("deveria retornar erro 401 se o email e/ou password for diferentes do cadastro", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const logged = repository.create({
      email: "any_email",
      id: "any_id",
      password: "any_password",
      username: "any_username",
    });

    await repository.save(logged);

    const res = await request(app)
      .post("/user/login")
      .send({
        email: logged.email,
        password: "wrong_password",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toEqual(
      "Email/Senha incorretos"
    );
  });

  test("deveria retornar erro 500 quando o usecase gerar uma exceção", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const user = repository.create({
      email: "any_email",
      id: "any_id",
      password: "any_password",
      username: "any_username",
    });
    await repository.save(user);

    const LoginUsecaseSpy = jest
      .spyOn(LoginUsecase.prototype, "execute")
      .mockImplementation(
        ({ email, password }) => {
          throw new Error(
            "Erro simulado no usecase"
          );
        }
      );

    const res = await request(app)
      .post("/user/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
    expect(LoginUsecaseSpy).toHaveBeenCalled();
    expect(LoginUsecaseSpy).toHaveBeenCalledWith({
      email: "any_email",
      password: "any_password",
    });
    expect(LoginUsecaseSpy).toHaveBeenCalledTimes(
      1
    );
  });

  test("deveria retornar sucesso (200) quando o login for feito com sucesso", async () => {
    const repository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );

    const user = repository.create({
      email: "any_email",
      id: "any_id",
      password: "any_password",
      username: "any_username",
    });
    await repository.save(user);

    const res = await request(app)
      .post("/user/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual(
      "Login feito com sucesso"
    );
  });
});
