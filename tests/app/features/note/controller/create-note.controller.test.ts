import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { User } from "../../../../../src/app/models/user.model";
import { Note } from "../../../../../src/app/models/note.model";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";

describe("Create note controller test", () => {
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
    await TypeormConnection.connection
      .getRepository(NoteEntity)
      .clear();
  });

  const app = createApp();

  const user: User = new User(
    "any_name",
    "any_email",
    "any_password"
  );

  const note: Note = new Note(
    "any_title",
    "any_description"
  );

  test("deveria retornar erro 400 se o titulo não for informado", async () => {
    const res = await request(app)
      .post("/user/:userId/notes")
      .send({});

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Titulo nao informado"
    );
  });

  test("deveria retornar erro 400 se a descrição não for informado", async () => {
    const res = await request(app)
      .post("/user/:userId/notes")
      .send({ title: "any_title" });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Descriçao nao informado"
    );
  });

  test("deveria retornar erro 400 se o titulo for menor que 3 caracteres", async () => {
    const res = await request(app)
      .post("/user/:userId/notes")
      .send({
        title: "ti",
        description: "any_description",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Titulo precisa ter ao menos 3 caracteres"
    );
  });

  test("deveria retornar erro 400 se a descrição for menor que 3 caracteres", async () => {
    const res = await request(app)
      .post("/user/:userId/notes")
      .send({
        title: "any_title",
        description: "de",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      "Descriçao precisa ter ao menos 3 caracteres"
    );
  });

  test("deveria retornar erro 404 se o usuario não for encontrado", async () => {
    const res = await request(app)
      .post("/user/:userId/notes")
      .send({
        title: "any_title",
        description: "any_description",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual(
      "O usuario não foi encontrado"
    );
  });

  test("deveria retornar sucesso (201) se a nota for criada com sucesso", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );
    const newUser = userRepository.create(user);
    await userRepository.save(newUser);

    const res = await request(app)
      .post(`/user/${newUser.id}/notes`)
      .send({
        title: "any_title",
        description: "any_description",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(201);
    expect(res).toHaveProperty("body");
    expect(res.body.message).toEqual(
      "Nota criada com sucesso"
    );
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveProperty(
      "_filed",
      false
    );
  });

  test("deveria retornar erro 500 quando o usecase gerar uma exceção", async () => {
    const noteUsecaseSpy = jest
      .spyOn(
        CreateNoteUsecase.prototype,
        "execute"
      )
      .mockImplementation((_: any) => {
        throw new Error(
          "Erro simulado no usecase"
        );
      });
    const res = await request(app)
      .post("/user/:userId/notes")
      .send({
        title: "any_title",
        description: "any_description",
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
    expect(noteUsecaseSpy).toHaveBeenCalled();
    expect(noteUsecaseSpy).toHaveBeenCalledTimes(
      1
    );
  });
});
