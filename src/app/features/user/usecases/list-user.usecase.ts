import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

export class ListUserUsecase {
  public async execute(): Promise<Return> {
    const repository = new UserRepository();
    let userListRepository =
      await repository.list();

    const userList = userListRepository.map(
      (user) => user.toJson()
    );

    return {
      ok: true,
      code: 200,
      message: "Usuarios listados com sucesso",
      data: userList,
    };
  }
}
