import { getDb } from '../index';

export const FavoritesRepo = {
  async listForContext(contextId: string): Promise<string[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ prompt_id: string }>(
      'SELECT prompt_id FROM favorites WHERE context_id = ? ORDER BY favorited_at DESC',
      contextId
    );
    return rows.map(r => r.prompt_id);
  },

  async add(contextId: string, promptId: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      'INSERT OR IGNORE INTO favorites (context_id, prompt_id, favorited_at) VALUES (?, ?, ?)',
      contextId,
      promptId,
      new Date().toISOString()
    );
  },

  async remove(contextId: string, promptId: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      'DELETE FROM favorites WHERE context_id = ? AND prompt_id = ?',
      contextId,
      promptId
    );
  },
};
