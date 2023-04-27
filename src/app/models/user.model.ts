import { v4 as createUuid } from "uuid";
import { Note } from "./note.model";

export class User {
  private _id: string;
  private _notes: Note[];

  constructor(
    private _username: string,
    private _email: string,
    private _password: string
  ) {
    this._id = createUuid();
    this._notes = [];
  }

  public get id() {
    return this._id;
  }

  public get username() {
    return this._username;
  }

  public set username(name: string) {
    this._username = name;
  }

  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get password() {
    return this._password;
  }

  public set password(password: string) {
    this._password = password;
  }

  public get notes() {
    return this._notes ?? [];
  }

  public set notes(notes: Note[]) {
    this._notes = notes;
  }

  public toJson() {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      notes: this._notes,
    };
  }

  public addNote(note: Note) {
    this._notes.push(note);
  }

  public static create(
    id: string,
    username: string,
    email: string,
    password: string,
    notes?: Note[]
  ) {
    const user = new User(
      username,
      email,
      password
    );
    user._id = id;
    user._notes = notes ?? [];
    return user;
  }
}
