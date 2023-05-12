import { Router } from "express";
import { NoteController } from "../controller/note.controller";
import { CreateNoteValidator } from "../validators/create-note.validator";
import { UpdateNoteValidator } from "../validators/update-note.validator";
import { ListNoteValidator } from "../validators/list-note.validator";

export const noteRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  app.post(
    "/",
    CreateNoteValidator.validate,
    new NoteController().create
  );

  app.get(
    "/",
    ListNoteValidator.validate,
    new NoteController().listAll
  );

  app.get(
    "/:noteId",
    new NoteController().getOne
  );

  app.delete(
    "/:noteId",
    new NoteController().delete
  );

  app.put(
    "/:noteId",
    UpdateNoteValidator.validate,
    new NoteController().update
  );

  return app;
};
