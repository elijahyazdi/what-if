// PLACEHOLDER CONTENT
// Seeds a starter "Conversation Series" module per age group so the modules
// framework has visible content in dev/demo. Each module reuses the seeded
// placeholder prompts as its steps.

import * as SQLite from 'expo-sqlite';

const MODULES = [
  {
    id: 'mod-empathy-3-5',
    title: 'Sharing & Kindness',
    description: '[PLACEHOLDER] A 3-day series for little ones learning to share.',
    ageGroup: '3-5',
    categoryId: 'cat-ethics',
    cover: '#90dcff',
    steps: [
      { promptId: 'ph-3-5-001', intro: 'Start with something they care about.', outro: 'Notice what feelings came up.' },
      { promptId: 'ph-3-5-002', intro: 'Mistakes happen. What do we do next?', outro: 'Celebrate small acts of repair.' },
      { promptId: 'ph-3-5-003', intro: 'Talk about feeling safe.', outro: 'Ask what helps them feel brave.' },
    ],
  },
  {
    id: 'mod-belonging-6-8',
    title: 'Belonging at School',
    description: '[PLACEHOLDER] Building empathy and inclusion habits.',
    ageGroup: '6-8',
    categoryId: 'cat-ethics',
    cover: '#00db96',
    steps: [
      { promptId: 'ph-6-8-001', intro: null, outro: null },
      { promptId: 'ph-6-8-002', intro: null, outro: null },
      { promptId: 'ph-6-8-003', intro: null, outro: null },
    ],
  },
  {
    id: 'mod-integrity-9-12',
    title: 'Integrity Under Pressure',
    description: '[PLACEHOLDER] Hard choices about honesty and friendship.',
    ageGroup: '9-12',
    categoryId: 'cat-ethics',
    cover: '#e10086',
    steps: [
      { promptId: 'ph-9-12-001', intro: null, outro: null },
      { promptId: 'ph-9-12-002', intro: null, outro: null },
      { promptId: 'ph-9-12-003', intro: null, outro: null },
    ],
  },
  {
    id: 'mod-identity-13-15',
    title: 'Standing for Yourself',
    description: '[PLACEHOLDER] Identity, pressure, and finding your voice.',
    ageGroup: '13-15',
    categoryId: 'cat-emotions',
    cover: '#fdfb76',
    steps: [
      { promptId: 'ph-13-15-001', intro: null, outro: null },
      { promptId: 'ph-13-15-002', intro: null, outro: null },
      { promptId: 'ph-13-15-003', intro: null, outro: null },
    ],
  },
];

export const migration_0005_seed_modules = {
  name: '0005_seed_modules',
  async up(db: SQLite.SQLiteDatabase): Promise<void> {
    let order = 0;
    for (const m of MODULES) {
      await db.runAsync(
        `INSERT INTO modules
         (id, title, description, age_group, category_id, duration_days, tier, cover_color, display_order, is_placeholder)
         VALUES (?, ?, ?, ?, ?, ?, 'free', ?, ?, 1)`,
        m.id, m.title, m.description, m.ageGroup, m.categoryId, m.steps.length, m.cover, order
      );
      let step = 1;
      for (const s of m.steps) {
        await db.runAsync(
          `INSERT INTO module_steps (module_id, step_number, prompt_id, intro_text, outro_text)
           VALUES (?, ?, ?, ?, ?)`,
          m.id, step, s.promptId, s.intro, s.outro
        );
        step++;
      }
      order++;
    }
  },
};
