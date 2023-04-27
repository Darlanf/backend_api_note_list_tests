import { Router } from "express";
import { NoteController } from "../app/features/note/controller/note.controller";
import { UserController } from "../app/features/user/controller/user.controller";
import { NoteValidatorMiddleware } from "../middlewares/note.validator.middleware";
import { UserValidatorMiddleware } from "../middlewares/user.validator.middleware";

// http://localhost:3333/user
export const userRoutes = () => {
  const app = Router();

  // POST http://localhost:3333/user - Permite criar um novo usuário
  app.post(
    "/",
    [
      UserValidatorMiddleware.mandatoryFields,
      UserValidatorMiddleware.emailAlreadyExist,
    ],
    new UserController().create
  );

  // POST http://localhost:3333/user/login - Permite o login do usuário
  app.post(
    "/login",
    // UserValidatorMiddleware.isLoginValid,
    new UserController().login
  );

  //   GET http://localhost:3333/user - permite listar usuários
  app.get("/", new UserController().list);

  //   GET http://localhost:3333/user - permite listar usuários
  app.get(
    "/:userId",
    new UserController().listOne
  );

  // DELETE http://localhost:3333/user/:userId - Permite deletar um usuário
  app.delete(
    "/:userId",
    new UserController().delete
  );

  // PUT http://localhost:3333/user/:userId - Permite editar um usuário
  app.put(
    "/:userId",
    new UserController().update
  );

  // GET http://localhost:3333/user/:userId/notes - Lista as notas do usuário
  app.get(
    "/:userId/notes",
    // NoteValidatorMiddleware.userExist,
    new NoteController().listAll
  );

  // GET http://localhost:3333/user/:userId/notes/:noteId - Lista uma nota do usuário
  app.get(
    "/:userId/notes/:noteId",
    NoteValidatorMiddleware.userAndNoteExist,
    new NoteController().listOne
  );

  // POST http://localhost:3333/user/:userId/notes - Permite criar uma nota
  app.post(
    "/:userId/notes",
    [
      // NoteValidatorMiddleware.userExist,
      NoteValidatorMiddleware.mandatoryFields,
    ],
    new NoteController().create
  );

  // PUT http://localhost:3333/user/:userId/notes/:noteId -  Permite editar uma nota
  app.put(
    "/:userId/notes/:noteId",
    NoteValidatorMiddleware.userAndNoteExist,
    new NoteController().update
  );

  // DELETE http://localhost:3333/user/:userId/notes/:noteId - Permite deletar uma nota
  app.delete(
    "/:userId/notes/:noteId",
    NoteValidatorMiddleware.userAndNoteExist,
    new NoteController().delete
  );

  app.all("/*", (req, res) => {
    return res.status(500).send({
      ok: false,
      message: "rota não encontrada",
    });
  });

  return app;
};
