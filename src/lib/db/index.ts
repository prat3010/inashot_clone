import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'local.db');
const sqlite = new Database(dbPath);

// Enable WAL mode for high performance concurrent local reads
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export { schema };
