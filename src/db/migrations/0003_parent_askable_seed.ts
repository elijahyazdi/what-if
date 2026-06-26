// PLACEHOLDER CONTENT
// Marks a sample of seeded prompts as parent_askable=1 so the kids-ask-parents
// toggle has prompts to surface in dev/demo. Real prompts will arrive tagged
// from the content team's authoring tool.

import * as SQLite from 'expo-sqlite';

const PARENT_ASKABLE_IDS = [
  'ph-3-5-001',
  'ph-3-5-003',
  'ph-6-8-001',
  'ph-6-8-003',
  'ph-9-12-002',
  'ph-13-15-003',
];

export const migration_0003_parent_askable_seed = {
  name: '0003_parent_askable_seed',
  async up(db: SQLite.SQLiteDatabase): Promise<void> {
    for (const id of PARENT_ASKABLE_IDS) {
      await db.runAsync('UPDATE prompts SET parent_askable = 1 WHERE id = ?', id);
    }
  },
};
