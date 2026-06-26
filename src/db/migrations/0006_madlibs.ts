// PLACEHOLDER CONTENT
// Schema + seed for the Mad Libs question builder (Premium feature).
// Templates use {slot:type} markers — the builder reads slots_json for slot
// types and labels, then substitutes user fills into the template_text.

import * as SQLite from 'expo-sqlite';

const SCHEMA = `
  CREATE TABLE mad_libs_templates (
    id             TEXT PRIMARY KEY,
    age_group      TEXT NOT NULL,
    template_text  TEXT NOT NULL,
    slots_json     TEXT NOT NULL,
    tier           TEXT NOT NULL DEFAULT 'premium',
    display_order  INTEGER NOT NULL DEFAULT 0,
    is_placeholder INTEGER NOT NULL DEFAULT 0
  );
`;

const TEMPLATES = [
  {
    id: 'ml-3-5-001',
    ageGroup: '3-5',
    text: 'What if {0} took your {1} without asking? What could you do?',
    slots: [
      { label: 'A person', type: 'person', suggestions: ['your sister', 'your friend', 'a kid at the park'] },
      { label: 'An object', type: 'object', suggestions: ['toy', 'snack', 'book'] },
    ],
  },
  {
    id: 'ml-6-8-001',
    ageGroup: '6-8',
    text: 'What if you saw someone being {0} at {1}? What could you do?',
    slots: [
      { label: 'A behavior', type: 'tone', suggestions: ['unkind', 'left out', 'embarrassed'] },
      { label: 'A place', type: 'place', suggestions: ['lunch', 'the bus stop', 'recess'] },
    ],
  },
  {
    id: 'ml-9-12-001',
    ageGroup: '9-12',
    text: 'What if a friend pressured you to {0} when you really wanted to {1}? What could you do?',
    slots: [
      { label: 'Pressure to', type: 'activity', suggestions: ['skip class', 'lie to a parent', 'gossip about someone'] },
      { label: 'What you wanted', type: 'activity', suggestions: ['say no', 'walk away', 'tell the truth'] },
    ],
  },
  {
    id: 'ml-13-15-001',
    ageGroup: '13-15',
    text: 'What if you discovered {0} was struggling with {1}? What could you do?',
    slots: [
      { label: 'Someone', type: 'person', suggestions: ['a close friend', 'your sibling', 'a teammate'] },
      { label: 'A challenge', type: 'tone', suggestions: ['anxiety', 'a family problem', 'feeling like they don\'t fit in'] },
    ],
  },
];

export const migration_0006_madlibs = {
  name: '0006_madlibs',
  async up(db: SQLite.SQLiteDatabase): Promise<void> {
    await db.execAsync(SCHEMA);
    let order = 0;
    for (const t of TEMPLATES) {
      await db.runAsync(
        `INSERT INTO mad_libs_templates (id, age_group, template_text, slots_json, tier, display_order, is_placeholder)
         VALUES (?, ?, ?, ?, 'premium', ?, 1)`,
        t.id, t.ageGroup, t.text, JSON.stringify(t.slots), order
      );
      order++;
    }
  },
};
