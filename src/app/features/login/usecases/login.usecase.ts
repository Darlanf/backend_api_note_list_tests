import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../../user/repository/user.repository";

interface LoginParams {
  email: string;
  password: string;
}
export class LoginUsecase {
  public async execute(
    data: LoginParams
  ): Promise<Return> {
    const repository = new UserRepository();
    const user = await repository.login(
      data.email,
      data.password
    );

    if (!user) {
      return {
        ok: false,
        code: 401,
        message: "Email/Senha incorretos",
      };
    }

    return {
      ok: true,
      code: 200,
      message: "Login feito com sucesso",
      data: user,
    };
  }
}
