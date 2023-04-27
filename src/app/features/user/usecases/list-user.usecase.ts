import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

export class ListUserUsecase {
  public async execute(): Promise<Return> {
    const cacheRepository = new CacheRepository();
    let userList = await cacheRepository.get(
      "listaDeUsuarios"
    );

    if (userList) {
      return {
        ok: true,
        code: 200,
        message:
          "Usuarios listados com sucesso - cache",
        data: userList,
      };
    }

    const repository = new UserRepository();
    userList = await repository.list();

    return {
      ok: true,
      code: 200,
      message: "Usuarios listados com sucesso",
      data: userList,
    };
  }
}
