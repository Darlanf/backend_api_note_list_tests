import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NoteEntity } from "./note.entity";

@Entity({
  name: "user",
})
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 30 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 12 })
  password: string;

  @CreateDateColumn({
    name: "created_at",
    // type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    // type: "timestamp",
  })
  updatedAt: Date;

  @OneToMany(
    () => NoteEntity,
    (note) => note.user
  )
  notes: NoteEntity[];
}
