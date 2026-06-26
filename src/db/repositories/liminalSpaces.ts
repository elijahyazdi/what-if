import { getDb } from '../index';
import { LiminalSpace } from '../types';

type Row = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_placeholder: number;
};

const fromRow = (r: Row): LiminalSpace => ({
  id: r.id,
  name: r.name,
  description: r.description,
  icon: r.icon,
  displayOrder: r.display_order,
  isPlaceholder: r.is_placeholder === 1,
});

export const LiminalSpaceRepo = {
  async list(): Promise<LiminalSpace[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<Row>('SELECT * FROM liminal_spaces ORDER BY display_order');
    return rows.map(fromRow);
  },
};
