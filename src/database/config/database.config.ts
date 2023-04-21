import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

let entities = "src/database/entities/**/*.ts";
let migrations =
  "src/database/migrations/**/*.ts";

if (process.env.DB_SYS != "dev") {
  entities = "build/database/entities/**/*.js";
  migrations =
    "build/database/migrations/**/*.js";
}

export default new DataSource({
  type: "postgres",
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: [entities],
  migrations: [migrations],
  schema: "avaliacao",
});
