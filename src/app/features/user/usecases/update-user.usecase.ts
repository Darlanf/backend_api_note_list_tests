import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

interface UpdateUserParams {
  userId: string;
  username?: string;
  password?: string;
}

export class UpdateUserUsecase {
  public async execute(
    data: UpdateUserParams
  ): Promise<Return> {
    const repository = new UserRepository();

    const result = await repository.update(
      data.userId,
      {
        username: data.username,
        password: data.password,
      }
    );

    if (result === 0) {
      return {
        ok: false,
        code: 404,
        message: "Usuario nao encontrado",
      };
    }

    return {
      ok: true,
      data: data.userId,
      message: "Usuario editado com sucesso",
      code: 200,
    };
  }
}
