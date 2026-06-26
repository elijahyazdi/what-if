import { getDb } from '../index';

export type FAQEntry = {
  id: string;
  category: string;
  question: string;
  answer: string;
  tier: string;
  isPlaceholder: boolean;
};

export type Resource = {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  url: string | null;
  region: string;
  safetySignal: string | null;
  tier: string;
  isPlaceholder: boolean;
};

type FAQRow = {
  id: string;
  category: string;
  question: string;
  answer: string;
  tier: string;
  display_order: number;
  is_placeholder: number;
};

type ResourceRow = {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  url: string | null;
  region: string;
  safety_signal: string | null;
  tier: string;
  display_order: number;
  is_placeholder: number;
};

export const FAQRepo = {
  async list(): Promise<FAQEntry[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FAQRow>(
      'SELECT * FROM faq_entries ORDER BY category, display_order'
    );
    return rows.map(r => ({
      id: r.id,
      category: r.category,
      question: r.question,
      answer: r.answer,
      tier: r.tier,
      isPlaceholder: r.is_placeholder === 1,
    }));
  },
};

export const ResourceRepo = {
  async forSignal(signal: string | null): Promise<Resource[]> {
    const db = await getDb();
    const rows = signal
      ? await db.getAllAsync<ResourceRow>(
          'SELECT * FROM resources WHERE safety_signal = ? ORDER BY display_order',
          signal
        )
      : await db.getAllAsync<ResourceRow>('SELECT * FROM resources ORDER BY display_order');
    return rows.map(r => ({
      id: r.id,
      kind: r.kind,
      title: r.title,
      description: r.description,
      url: r.url,
      region: r.region,
      safetySignal: r.safety_signal,
      tier: r.tier,
      isPlaceholder: r.is_placeholder === 1,
    }));
  },
};
