import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
});
