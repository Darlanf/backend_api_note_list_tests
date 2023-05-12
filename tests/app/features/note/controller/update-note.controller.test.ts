import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { User } from "../../../../../src/app/models/user.model";
import { Note } from "../../../../../src/app/models/note.model";
import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usecase";

describe("Update notes controller tests", () => {
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

  //   "/user/:userId/notes/:noteId",

  test("deveria retornar erro 400 se o titulo for menor que 3 caracteres", async () => {
    const res = await request(app)
      .put("/user/userId/notes/noteId")
      .send({ title: "ti" });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      "Titulo precisa ter ao menos 3 caracteres"
    );
  });

  test("deveria retornar erro 400 se a descrição for menor que 6 caracteres", async () => {
    const res = await request(app)
      .put("/user/userId/notes/noteId")
      .send({ description: "any_d" });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      "Descriçao precisa ter ao menos 6 caracteres"
    );
  });

  test("deveria retornar erro 400 se o campo filed estiver incorreto", async () => {
    const res = await request(app)
      .put("/user/userId/notes/noteId")
      .send({ filed: 123 });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(400);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      "Preencha o campo arquivada corretamente"
    );
  });

  test("deveria retornar erro 404 se o usuario nao for encontrado", async () => {
    const res = await request(app)
      .put("/user/userId/notes/noteId")
      .send({});

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(404);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      "Usuario nao encontrado"
    );
  });

  test("deveria retornar sucesso (200) se a nota for editada corretamente", async () => {
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
      id: note.id,
      idUser: newUser.id,
    });
    await noteRepository.save(newNote);

    const res = await request(app)
      .put(
        `/user/${newUser.id}/notes/${newNote.id}`
      )
      .send({
        title: "edit_title",
        description: "edit_description",
        filed: true,
      });

    const editedNote =
      await noteRepository.findOneBy({
        id: newNote.id,
      });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty(
      ["body", "message"],
      "Nota editada com sucesso"
    );
    expect(res.body).toHaveProperty("data");
    expect(editedNote?.title).toMatch(
      "edit_title"
    );
    expect(editedNote?.description).toMatch(
      "edit_description"
    );
    expect(editedNote?.filed).toBeTruthy();
  });

  test("deveria retornar erro 500 se o usecase gerar uma exceção", async () => {
    const UpdadeNoteUsecaseSpy = jest
      .spyOn(
        UpdateNoteUsecase.prototype,
        "execute"
      )
      .mockImplementation((_: any) => {
        throw new Error(
          "Erro simulado do usecase"
        );
      });

    const res = await request(app)
      .put(`/user/userId/notes/noteId`)
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
    expect(
      UpdadeNoteUsecaseSpy
    ).toHaveBeenCalledTimes(1);
  });
});
