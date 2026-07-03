import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare const process: {
  env: {
    DATABASE_URL?: string;
  };
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida");
}

const client = postgres(connectionString);

export const db = drizzle(client);