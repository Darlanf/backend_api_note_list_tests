import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { User } from "../../../models/user.model";
import { UserEntity } from "../../../shared/database/entities/user.entity";
import { NoteRepository } from "../../note/repository/note.repository";

export class UserRepository {
  private repository =
    TypeormConnection.connection.getRepository(
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
    const notesEntity = entity.notes ?? [];
    const notes = notesEntity.map((note) =>
      NoteRepository.mapEntityToModel(note)
    );
    return User.create(
      entity.id,
      entity.username,
      entity.email,
      entity.password,
      notes
    );
  }

  public async getUserById(
    id: string
  ): Promise<User | null> {
    const result =
      await this.repository.findOneBy({
        id,
      });

    if (!result) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  public async getUserByEmail(
    email: string
  ): Promise<User | null> {
    const result =
      await this.repository.findOneBy({
        email,
      });

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
    const result = await this.repository.delete({
      id,
    });

    return result.affected ?? 0;
  }

  public async update(
    id: string,
    data?: any
  ): Promise<number> {
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
