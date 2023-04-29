import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { CreateUserValidator } from "../validators/create-user-validator";
import { noteRoutes } from "../../note/routes/note.routes";
import { loginRoutes } from "../../login/routes/login.routes";

export const userRoutes = () => {
  const app = Router();

  app.post(
    "/",
    CreateUserValidator.validate,
    new UserController().create
  );

  app.get("/", new UserController().list);

  app.delete(
    "/:userId",
    new UserController().delete
  );

  app.put(
    "/:userId",
    new UserController().update
  );

  app.use("/:userId/notes", noteRoutes());

  app.use("/login", loginRoutes());

  app.all("/*", (req, res) => {
    return res.status(500).send({
      ok: false,
      message: "rota não encontrada",
    });
  });

  return app;
};
