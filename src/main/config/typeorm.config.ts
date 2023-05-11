import { DataSource } from "typeorm";
import { databaseEnv } from "../../app/env/database.env";

let entities =
  "src/app/shared/database/entities/**/*.ts";
let migrations =
  "src/app/shared/database/migrations/**/*.ts";

if (databaseEnv.nodeEnv !== "dev") {
  entities =
    "build/app/shared/database/entities/**/*.js";
  migrations =
    "build/app/shared/database/migrations/**/*.js";
}

let source = new DataSource({
  type: "postgres",
  host: databaseEnv.host,
  username: databaseEnv.username,
  password: databaseEnv.password,
  database: databaseEnv.database,
  schema: "avaliacao",
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: [entities],
  migrations: [migrations],
});

if (databaseEnv.apiEnv === "test") {
  source = new DataSource({
    type: "sqlite",
    database: "database.sqlite3",
    synchronize: false,
    entities: [entities],
    migrations: [
      "tests/app/shared/database/migrations/**/*.ts",
    ],
  });
}

export default source;
