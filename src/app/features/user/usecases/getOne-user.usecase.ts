import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

export class GetOneUserUsecase {
  public async execute(
    userId: string
  ): Promise<Return> {
    const database = new UserRepository();
    const user = await database.getUserById(
      userId
    );

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "Usuario nao encontrado",
      };
    }

    return {
      ok: true,
      code: 200,
      message: "Usuario encontrado",
      data: user.toJson(),
    };
  }
}
