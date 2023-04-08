import { User } from "../../models/user.model";
import { DatabaseConnection } from "../config/databse.connection";
import { UserEntity } from "../entities/user.entity";

export class UserDatabase {
  private repository =
    DatabaseConnection.connection.getRepository(
      UserEntity
    );

  public async list(): Promise<User[]> {
    const result = await this.repository.find({
      relations: ["notes"],
    });
    return result.map((user) =>
      this.mapEntityToModel(user)
    );
  }

  public async login(
    email: string,
    password: string
  ) {
    const result = await this.repository.findOne({
      where: {
        email,
        password,
      },
    });
    if (!result) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  private mapEntityToModel(
    entity: UserEntity
  ): User {
    return User.create(
      entity.id,
      entity.username,
      entity.email,
      entity.password
    );
  }

  public async getUserById(
    id: string
  ): Promise<User | null> {
    const result =
      await this.repository.findOneBy({
        id,
      });
    // await DatabaseConnection.connection.query(
    //   `select * from teste.user where id = '${id}'`
    // );
    if (!result) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  public async create(user: User) {
    const userEntity = this.repository.create({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
    });

    const result = await this.repository.save(
      userEntity
    );

    return this.mapEntityToModel(result);
  }

  public async delete(
    id: string
  ): Promise<number> {
    // await DatabaseConnection.connection.query(
    //   `delete from teste.user where id = '${id}'`
    // );
    const result = await this.repository.delete({
      id,
    });

    return result.affected ?? 0;
  }

  public async update(
    id: string,
    data?: any
  ): Promise<number> {
    // let query = `update teste.user `;
    // query += `set username = '${data.username}', password = '${data.password}', updated_at = current_timestamp `;
    // query += `where id = '${id}' `;
    // await DatabaseConnection.connection.query(
    //   query
    // );

    const result = await this.repository.update(
      {
        id,
      },
      {
        username: data.username,
        password: data.password,
      }
    );
    return result.affected ?? 0;
  }
}
