import { DataSource } from "typeorm";
import typeormconfig from "../config/typeorm.config";

export class TypeormConnection {
  private static _connection: DataSource;

  public static async init() {
    this._connection =
      await typeormconfig.initialize();
    console.log("Typeorm is ready.");
  }

  public static get connection() {
    return this._connection;
  }
}
