import { getDb } from '../index';

export type MadLibsSlot = {
  label: string;
  type: string;
  suggestions: string[];
};

export type MadLibsTemplate = {
  id: string;
  ageGroup: string;
  templateText: string;
  slots: MadLibsSlot[];
  tier: string;
  isPlaceholder: boolean;
};

type Row = {
  id: string;
  age_group: string;
  template_text: string;
  slots_json: string;
  tier: string;
  display_order: number;
  is_placeholder: number;
};

const fromRow = (r: Row): MadLibsTemplate => ({
  id: r.id,
  ageGroup: r.age_group,
  templateText: r.template_text,
  slots: JSON.parse(r.slots_json) as MadLibsSlot[],
  tier: r.tier,
  isPlaceholder: r.is_placeholder === 1,
});

export const MadLibsRepo = {
  async list(): Promise<MadLibsTemplate[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<Row>(
      'SELECT * FROM mad_libs_templates ORDER BY display_order'
    );
    return rows.map(fromRow);
  },

  async saveAsUserPrompt(input: {
    id: string;
    ageGroup: string;
    text: string;
  }): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO prompts
       (id, age_group, category_id, text, tier, source, parent_askable, is_active, is_placeholder, created_at, updated_at)
       VALUES (?, ?, NULL, ?, 'free', 'user', 0, 1, 0, ?, ?)`,
      input.id,
      input.ageGroup,
      input.text,
      now,
      now
    );
  },
};

export function applyTemplate(template: string, fills: string[]): string {
  return template.replace(/\{(\d+)\}/g, (_, i) => fills[Number(i)] ?? '___');
}
