import { User } from "../../../models/user.model";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

interface CreateUserParams {
  username: string;
  email: string;
  password: string;
}

export class CreateUserUsecase {
  public async execute(
    data: CreateUserParams
  ): Promise<Return> {
    if (data.username.length > 30) {
      return {
        ok: false,
        code: 400,
        message:
          "Username pode ter no maximo 30 caracteres",
      };
    }

    if (data.password.length > 12) {
      return {
        ok: false,
        code: 400,
        message:
          "Password pode ter no maximo 12 caracteres",
      };
    }

    const newUser = new User(
      data.username,
      data.email,
      data.password
    );

    const repository = new UserRepository();

    const result = await repository.create(
      newUser
    );

    return {
      ok: true,
      code: 201,
      message: "Usuario criado com sucesso",
      data: result.toJson(),
    };
  }
}
