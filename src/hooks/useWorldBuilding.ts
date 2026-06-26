import { useEffect, useState } from 'react';
import { WorldBuildingRepo } from '../db/repositories/worldBuilding';
import { WorldBuildingCard } from '../db/types';

export function useWorldBuilding(promptId: string | null | undefined): {
  cards: WorldBuildingCard[];
  loading: boolean;
} {
  const [cards, setCards] = useState<WorldBuildingCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!promptId) {
      setCards([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    WorldBuildingRepo.findForPrompt(promptId).then(rows => {
      if (cancelled) return;
      setCards(rows);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [promptId]);

  return { cards, loading };
}
