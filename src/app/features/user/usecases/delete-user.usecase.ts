import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

export class DeleteUserUsecase {
  public async execute(
    userId: string
  ): Promise<Return> {
    const repository = new UserRepository();

    // validator?
    // if (!userId) {
    //     return RequestError.notProvided(
    //       res,
    //       "User id"
    //     );
    //   }

    const result = await repository.delete(
      userId
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
    await cacheRepository.delete(
      `listaDeNotas:${userId}`
    );

    return {
      ok: true,
      data: userId,
      message: "Usuario excluido com sucesso",
      code: 200,
    };
  }
}
