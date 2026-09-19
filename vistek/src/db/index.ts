import { config } from "dotenv";
// Force environment variables to load immediately before anything else
config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

//  crash loudly if the URL is missing instead of failing silently to localhost
if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL is missing or undefined.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // some cloud providers explicitly require SSL for remote connections
  ssl:
    process.env.NODE_ENV === "production"
      ? undefined
      : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
