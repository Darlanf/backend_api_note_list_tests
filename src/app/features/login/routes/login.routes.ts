import { Router } from "express";
import { LoginController } from "../controller/login.controller";
import { LoginValidator } from "../validators/login.validator";

export const loginRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  app.post(
    "/",
    LoginValidator.validate,
    new LoginController().login
  );

  return app;
};
