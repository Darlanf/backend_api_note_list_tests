import { Router } from "express";
import { NoteController } from "../controller/note.controller";

export const noteRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  app.post("/", new NoteController().create);

  app.get("/", new NoteController().listAll);

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
    new NoteController().update
  );

  return app;
};
