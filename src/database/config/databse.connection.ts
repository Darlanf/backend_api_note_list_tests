// import { PoolClient } from "pg";
import { DataSource } from "typeorm";
import config from "./database.config";

export class DatabaseConnection {
  private static _connection: DataSource;

  public static async connect() {
    this._connection = await config.initialize();
  }

  public static get connection() {
    return this._connection;
  }
}
