import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

export class DeleteUserUsecase {
  public async execute(
    userId: string
  ): Promise<Return> {
    const repository = new UserRepository();

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

    const keys = await cacheRepository.listByKeys(
      `listaDeNotas:${userId}:*`
    );

    keys.forEach(async (key) => {
      await cacheRepository.delete(key);
    });

    return {
      ok: true,
      data: userId,
      message: "Usuario excluido com sucesso",
      code: 200,
    };
  }
}
