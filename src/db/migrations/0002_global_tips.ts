// PLACEHOLDER CONTENT
// Global tips (prompt_id IS NULL) act as fallback when a prompt has no per-prompt tips.
// They mirror the four discussion tips that previously appeared as a static panel,
// so the UX is preserved for any prompt that arrives without specific tips.

import * as SQLite from 'expo-sqlite';

const GLOBAL_TIPS = [
  { id: 'tip-global-listen',     kind: 'discussion',  body: 'Listen without judgment.',          order: 0 },
  { id: 'tip-global-followup',   kind: 'follow_up',   body: 'Ask follow-up questions.',          order: 1 },
  { id: 'tip-global-explore',    kind: 'discussion',  body: 'Explore multiple solutions.',       order: 2 },
  { id: 'tip-global-share',      kind: 'kickstarter', body: 'Share your own thoughts too.',      order: 3 },
];

export const migration_0002_global_tips = {
  name: '0002_global_tips',
  async up(db: SQLite.SQLiteDatabase): Promise<void> {
    for (const t of GLOBAL_TIPS) {
      await db.runAsync(
        `INSERT INTO tips (id, prompt_id, kind, body, audience, display_order, is_placeholder)
         VALUES (?, NULL, ?, ?, 'adult', ?, 1)`,
        t.id, t.kind, t.body, t.order
      );
    }
  },
};
