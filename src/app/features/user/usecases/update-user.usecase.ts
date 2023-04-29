import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
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

    // validator?
    // if (!userId) {
    //     return RequestError.notProvided(
    //       res,
    //       "User"
    //     );
    //   }

    if (
      data.username !== undefined &&
      data.username.trim().length <= 0
    ) {
      return {
        ok: false,
        code: 400,
        message: "Nome de usuario invalido",
      };
    }

    if (
      data.password !== undefined &&
      data.password.trim().length <= 0
    ) {
      return {
        ok: false,
        code: 400,
        message: "Nome de usuario invalido",
      };
    }

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

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(
      "listaDeUsuarios"
    );

    return {
      ok: true,
      data: data.userId,
      message: "Usuario editado com sucesso",
      code: 200,
    };
  }
}
