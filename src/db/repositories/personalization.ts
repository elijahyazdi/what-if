import { getDb } from '../index';

export type PersonalizationData = {
  name?: string;
  location?: string;
  interest?: string;
};

export const PersonalizationKeys = ['name', 'location', 'interest'] as const;
export type PersonalizationKey = (typeof PersonalizationKeys)[number];

export const PersonalizationRepo = {
  async get(contextId: string): Promise<PersonalizationData> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      'SELECT key, value FROM personalization WHERE context_id = ?',
      contextId
    );
    const data: PersonalizationData = {};
    for (const r of rows) {
      if ((PersonalizationKeys as readonly string[]).includes(r.key)) {
        (data as Record<string, string>)[r.key] = r.value;
      }
    }
    return data;
  },

  async set(contextId: string, key: PersonalizationKey, value: string): Promise<void> {
    const db = await getDb();
    if (value.trim() === '') {
      await db.runAsync(
        'DELETE FROM personalization WHERE context_id = ? AND key = ?',
        contextId,
        key
      );
      return;
    }
    await db.runAsync(
      `INSERT INTO personalization (context_id, key, value) VALUES (?, ?, ?)
       ON CONFLICT(context_id, key) DO UPDATE SET value = excluded.value`,
      contextId,
      key,
      value.trim()
    );
  },
};
