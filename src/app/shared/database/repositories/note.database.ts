import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { NoteEntity } from "../entities/note.entity";
import { Note } from "../../../models/note.model";

export class NoteDatabase {
  private repository =
    TypeormConnection.connection.getRepository(
      NoteEntity
    );

  public async list(
    userId: string,
    title?: string
  ) {
    const result = await this.repository.find({
      where: {
        idUser: userId,
        title,
      },
      relations: ["user"],
    });

    return result.map((note) =>
      this.mapEntityToModel(note)
    );
  }

  private mapEntityToModel(
    entity: NoteEntity
  ): Note {
    return Note.create(
      entity.id,
      entity.title,
      entity.description,
      entity.filed
    );
  }

  public async getNoteById(id: string) {
    const result =
      await this.repository.findOneBy({ id });

    if (!result) {
      return 0;
    }

    return this.mapEntityToModel(result);
  }

  public async create(
    userId: string,
    note: Note
  ) {
    const noteEntity = this.repository.create({
      id: note.id,
      title: note.title,
      description: note.description,
      filed: note.filed,
      idUser: userId,
    });

    const result = await this.repository.save(
      noteEntity
    );
    return this.mapEntityToModel(result);
  }

  public async update(id: string, data?: any) {
    const result = await this.repository.update(
      {
        id,
      },
      {
        title: data.title,
        description: data.description,
        filed: data.filed,
      }
    );

    if (result.affected === 1) {
      return {
        id,
        data,
      };
    }

    return null;
  }

  public async delete(id: string) {
    const result = await this.repository.delete({
      id,
    });
    return result.affected ?? 0;
  }
}
