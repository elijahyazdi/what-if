// PLACEHOLDER CONTENT — PENDING CLINICAL REVIEW
// Schema + placeholder content for the FAQ and "I'm concerned" safety flow.
// The safety_signal field categorizes resources for the I'm-Concerned router.
// ALL resource and FAQ rows below are placeholders. They must be reviewed by
// a licensed clinician before shipping (see project_safety_review_gate.md).

import * as SQLite from 'expo-sqlite';

const SCHEMA = `
  CREATE TABLE faq_entries (
    id             TEXT PRIMARY KEY,
    category       TEXT NOT NULL,
    question       TEXT NOT NULL,
    answer         TEXT NOT NULL,
    tier           TEXT NOT NULL DEFAULT 'free',
    display_order  INTEGER NOT NULL DEFAULT 0,
    is_placeholder INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE resources (
    id              TEXT PRIMARY KEY,
    kind            TEXT NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    url             TEXT,
    region          TEXT NOT NULL DEFAULT 'US',
    safety_signal   TEXT,
    tier            TEXT NOT NULL DEFAULT 'free',
    display_order   INTEGER NOT NULL DEFAULT 0,
    is_placeholder  INTEGER NOT NULL DEFAULT 0
  );
`;

const FAQ_ENTRIES = [
  {
    category: 'Getting Started',
    question: '[PLACEHOLDER] How should I use this app?',
    answer:
      '[PLACEHOLDER] Pick an age group, read the prompt together, and listen. There are no right answers — focus on the thinking process. Use the Discussion Tips for ways to keep the conversation open.',
  },
  {
    category: 'Getting Started',
    question: '[PLACEHOLDER] What is "Add a twist"?',
    answer:
      '[PLACEHOLDER] Twists are follow-up "what if" scenarios that deepen the original prompt. Use them when the child is engaged and ready for more.',
  },
  {
    category: 'Conversation Tips',
    question: '[PLACEHOLDER] What if my child gives short answers?',
    answer:
      '[PLACEHOLDER] Try sharing your own thinking first, or ask "What else could someone try?" Open-ended follow-ups invite elaboration.',
  },
  {
    category: 'Privacy',
    question: '[PLACEHOLDER] Is my data shared?',
    answer:
      '[PLACEHOLDER] No. All reflections and personalization data stays on your device. Nothing syncs to a server in this prototype.',
  },
];

const RESOURCES = [
  {
    id: 'res-hotline-us-988',
    kind: 'hotline',
    title: '[PLACEHOLDER] 988 Suicide & Crisis Lifeline',
    description: '[PLACEHOLDER] Call or text 988 for free, 24/7 crisis support (US).',
    url: 'tel:988',
    region: 'US',
    safety_signal: 'safety',
  },
  {
    id: 'res-hotline-us-childhelp',
    kind: 'hotline',
    title: '[PLACEHOLDER] Childhelp National Child Abuse Hotline',
    description: '[PLACEHOLDER] 1-800-422-4453, 24/7, multilingual (US).',
    url: 'tel:18004224453',
    region: 'US',
    safety_signal: 'disclosure',
  },
  {
    id: 'res-article-mood',
    kind: 'article',
    title: '[PLACEHOLDER] When a child says something worrying',
    description: '[PLACEHOLDER] A guide for adults on staying calm, validating, and finding help.',
    url: null,
    region: 'US',
    safety_signal: 'mood',
  },
  {
    id: 'res-article-normal',
    kind: 'article',
    title: '[PLACEHOLDER] What\'s typical at this age?',
    description: '[PLACEHOLDER] Developmental context so you can tell concerning from normal.',
    url: null,
    region: 'US',
    safety_signal: 'just-checking',
  },
];

export const migration_0007_faq_and_resources = {
  name: '0007_faq_and_resources',
  async up(db: SQLite.SQLiteDatabase): Promise<void> {
    await db.execAsync(SCHEMA);
    let order = 0;
    for (const f of FAQ_ENTRIES) {
      await db.runAsync(
        'INSERT INTO faq_entries (id, category, question, answer, display_order, is_placeholder) VALUES (?, ?, ?, ?, ?, 1)',
        `faq-${order}`, f.category, f.question, f.answer, order
      );
      order++;
    }
    order = 0;
    for (const r of RESOURCES) {
      await db.runAsync(
        `INSERT INTO resources (id, kind, title, description, url, region, safety_signal, display_order, is_placeholder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        r.id, r.kind, r.title, r.description, r.url, r.region, r.safety_signal, order
      );
      order++;
    }
  },
};
