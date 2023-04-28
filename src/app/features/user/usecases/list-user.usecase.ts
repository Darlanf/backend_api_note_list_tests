import { User } from "../../../models/user.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

export class ListUserUsecase {
  public async execute(): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const userListCache =
      await cacheRepository.get<User[]>(
        "listaDeUsuarios"
      );

    if (userListCache !== null) {
      return {
        ok: true,
        code: 200,
        message:
          "Usuarios listados com sucesso - cache",
        data: userListCache,
      };
    }

    const repository = new UserRepository();
    let userListRepository =
      await repository.list();

    const userList = userListRepository.map(
      (user) => user.toJson()
    );

    await cacheRepository.set(
      "listaDeUsuarios",
      userList
    );

    return {
      ok: true,
      code: 200,
      message: "Usuarios listados com sucesso",
      data: userList,
    };
  }
}
