import { useEffect, useState } from 'react';
import { TipRepo } from '../db/repositories/tips';
import { Tip, TipKind } from '../db/types';

export type GroupedTips = Record<TipKind, Tip[]>;

const empty = (): GroupedTips => ({
  kickstarter: [],
  discussion: [],
  follow_up: [],
  safety_note: [],
});

export function useTipsForPrompt(promptId: string | null | undefined): {
  tips: GroupedTips;
  total: number;
  loading: boolean;
} {
  const [tips, setTips] = useState<GroupedTips>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!promptId) {
      setTips(empty());
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    TipRepo.findForPrompt(promptId).then(rows => {
      if (cancelled) return;
      const grouped = empty();
      for (const tip of rows) {
        grouped[tip.kind].push(tip);
      }
      setTips(grouped);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [promptId]);

  const total = Object.values(tips).reduce((sum, arr) => sum + arr.length, 0);
  return { tips, total, loading };
}
