import { Router } from "express";
import { LoginController } from "../controller/login.controller";

export const loginRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  app.post("/", new LoginController().login);

  return app;
};
