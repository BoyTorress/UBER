import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { dirname } from "path";

// Always use SQLite for this application
const dbPath = "./data/brandon-finanzas.db";

// Ensure directory exists
try {
  mkdirSync(dirname(dbPath), { recursive: true });
} catch (err) {
  // Directory might already exist
}

const sqlite = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite);
