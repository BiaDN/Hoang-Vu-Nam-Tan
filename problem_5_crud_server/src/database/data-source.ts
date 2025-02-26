import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } from '@config';

const AppDataSource = new DataSource({
  type: 'postgres',
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: +POSTGRES_PORT,
  database: POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: ['src/subscriber/*.subscriber{.ts,.js}'],
});

export default AppDataSource; // Quan trọng
