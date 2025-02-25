import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) ?? 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: ["app/entities/*.ts"], // Chỉ định nơi lưu các entity
  migrations: ["app/migrations/*.ts"],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => console.log("Database connected!"))
  .catch((error) => console.log("Database connection error: ", error));