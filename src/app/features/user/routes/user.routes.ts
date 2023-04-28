import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { CreateUserValidator } from "../validators/create-user-validator";

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

  return app;
};
