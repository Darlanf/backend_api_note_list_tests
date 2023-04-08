import { v4 as createUuid } from "uuid";

export class Note {
  private _id: string;
  private _filed: boolean;

  constructor(
    private _title: string,
    private _description: string
  ) {
    this._id = createUuid();
    this._filed = false;
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public get description() {
    return this._description;
  }

  public get filed() {
    return this._filed;
  }

  public set title(title: string) {
    this._title = title;
  }

  public set description(description: string) {
    this._description = description;
  }

  public set filed(filed: boolean) {
    this._filed = filed;
  }

  public toJson() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      filed: this._filed,
    };
  }

  public static create(
    id: string,
    title: string,
    description: string,
    filed: boolean
  ) {
    const note = new Note(title, description);
    note._id = id;
    note._filed = filed;
    return note;
  }
}
