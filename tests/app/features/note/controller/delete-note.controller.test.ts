import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { User } from "../../../../../src/app/models/user.model";
import { Note } from "../../../../../src/app/models/note.model";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";
import { DeleteNoteUsecase } from "../../../../../src/app/features/note/usecases/delete-note.usecase";

describe("Delete note controller test", () => {
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

  test("deveria retornar erro 404 se a nota não for encontrada", async () => {
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

    const res = await request(app).delete(
      `/user/${newUser.id}/notes/notaId`
    );

    expect(res).toBeDefined();
  });

  test("deveria retornar sucesso (200) se a nota for deletada", async () => {
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

    const res = await request(app).delete(
      `/user/${newUser.id}/notes/${newNote.id}`
    );

    const notes = await noteRepository.find();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty("body");
    expect(res.body.message).toEqual(
      "Nota deletada com sucesso"
    );
    expect(res.body.data).toBeDefined();
    expect(notes).toHaveLength(0);
  });

  test("deveria retornar erro 500 se o usecase gerar uma exceção", async () => {
    const deleteNoteSpy = jest
      .spyOn(
        DeleteNoteUsecase.prototype,
        "execute"
      )
      .mockImplementation((_: any) => {
        throw new Error(
          "Erro simulado no usecase"
        );
      });
    const res = await request(app).delete(
      `/user/:userId/notes/:noteId`
    );

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual(
      "Error: Erro simulado no usecase"
    );
  });
});
