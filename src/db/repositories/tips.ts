import { getDb } from '../index';
import { Tip, TipKind } from '../types';

type TipRow = {
  id: string;
  prompt_id: string | null;
  kind: string;
  body: string;
  audience: string;
  display_order: number;
  is_placeholder: number;
};

const fromRow = (r: TipRow): Tip => ({
  id: r.id,
  promptId: r.prompt_id,
  kind: r.kind as TipKind,
  body: r.body,
  audience: r.audience as Tip['audience'],
  displayOrder: r.display_order,
  isPlaceholder: r.is_placeholder === 1,
});

export const TipRepo = {
  // Returns tips for a given prompt: prompt-specific first (most relevant), global fallback after.
  async findForPrompt(promptId: string): Promise<Tip[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<TipRow>(
      `SELECT * FROM tips
       WHERE prompt_id = ? OR prompt_id IS NULL
       ORDER BY
         CASE WHEN prompt_id IS NULL THEN 1 ELSE 0 END,
         display_order`,
      promptId
    );
    return rows.map(fromRow);
  },
};
