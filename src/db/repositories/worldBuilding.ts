import { getDb } from '../index';
import { WorldBuildingCard } from '../types';

type WorldBuildingRow = {
  id: string;
  prompt_id: string;
  card_text: string;
  display_order: number;
  difficulty: number;
  is_placeholder: number;
};

const fromRow = (r: WorldBuildingRow): WorldBuildingCard => ({
  id: r.id,
  promptId: r.prompt_id,
  cardText: r.card_text,
  displayOrder: r.display_order,
  difficulty: r.difficulty,
  isPlaceholder: r.is_placeholder === 1,
});

export const WorldBuildingRepo = {
  async findForPrompt(promptId: string): Promise<WorldBuildingCard[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<WorldBuildingRow>(
      'SELECT * FROM world_building WHERE prompt_id = ? ORDER BY display_order',
      promptId
    );
    return rows.map(fromRow);
  },
};
