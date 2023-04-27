import { User } from "../../../models/user.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
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
    const repository = new UserRepository();

    const newUser = new User(
      data.username,
      data.email,
      data.password
    );

    const result = await repository.create(
      newUser
    );

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(
      "listaDeUsuarios"
    );

    return {
      ok: true,
      code: 201,
      message: "Usuario criado com sucesso",
      data: result,
    };
  }
}
