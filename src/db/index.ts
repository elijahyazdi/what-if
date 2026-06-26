import * as SQLite from 'expo-sqlite';
import { migrations } from './migrations';

const DB_NAME = 'whatif.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync('PRAGMA foreign_keys = ON;');
      return db;
    })();
  }
  return dbPromise;
}

export async function runMigrations(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const appliedRows = await db.getAllAsync<{ name: string }>('SELECT name FROM _migrations');
  const applied = new Set(appliedRows.map(r => r.name));

  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO _migrations (name, applied_at) VALUES (?, ?)',
        migration.name,
        new Date().toISOString()
      );
    });
  }
}

// Test/dev helper — wipes the database from disk so the next launch re-runs migrations.
// Not used in normal app flow.
export async function resetDbForTesting(): Promise<void> {
  dbPromise = null;
  await SQLite.deleteDatabaseAsync(DB_NAME);
}
