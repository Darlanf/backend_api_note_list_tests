import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { User } from "../../../../../src/app/models/user.model";
import { Note } from "../../../../../src/app/models/note.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { ListNoteUsecase } from "../../../../../src/app/features/note/usecases/list-note.usecase";

describe("List notes controller tests", () => {
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

  test("Deveria retornar erro 400 se o campo filed for passado incorretamente ", async () => {
    const res = await request(app)
      .get("/user/userId/notes")
      .query({ filed: "incorrec_filed" })
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toEqual(400);
    expect(res).toHaveProperty("body");
    expect(res.body.message).toMatch(
      "Preencha o campo arquivada corretamente"
    );
  });

  test("deveria retornar sucesso (200) se listar as notas", async () => {
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue(null);
    const userRepository =
      TypeormConnection.connection.getRepository(
        UserEntity
      );
    const noteRepository =
      TypeormConnection.connection.getRepository(
        NoteEntity
      );

    const newUser = userRepository.create(user);
    await userRepository.save(newUser);

    const newNote = noteRepository.create({
      title: note.title,
      description: note.description,
      filed: note.filed,
      idUser: newUser.id,
    });
    await noteRepository.save(newNote);

    const newNote2 = noteRepository.create({
      title: note.title,
      description: note.description,
      filed: true,
      idUser: newUser.id,
    });
    await noteRepository.save(newNote2);

    const res = await request(app)
      .get(`/user/${newUser.id}/notes`)
      .query({ filed: "false" })
      .send();
    console.log(res.body.data);

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Notas listadas com sucesso"
    );
    expect(res.body.data).toHaveLength(1);
  });

  test("deveria retornar erro 500 se o usecase gerar uma exceção", async () => {
    const listUsecaseSpy = jest
      .spyOn(ListNoteUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error(
          "Erro simulado do usecase"
        );
      });

    const res = await request(app)
      .get(`/user/userId/notes`)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      "Error: Erro simulado do usecase"
    );
  });
});
