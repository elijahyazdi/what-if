import { useEffect, useState, useCallback } from 'react';
import { PersonalizationRepo, PersonalizationData, PersonalizationKey } from '../db/repositories/personalization';
import { useActiveContext } from '../providers/ActiveContextProvider';

export function usePersonalization(): PersonalizationData {
  const { activeContext } = useActiveContext();
  const [data, setData] = useState<PersonalizationData>({});

  useEffect(() => {
    let cancelled = false;
    PersonalizationRepo.get(activeContext.id).then(d => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [activeContext.id]);

  return data;
}

export function usePersonalizationEditor() {
  const { activeContext } = useActiveContext();
  const [data, setData] = useState<PersonalizationData>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    PersonalizationRepo.get(activeContext.id).then(d => {
      if (cancelled) return;
      setData(d);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [activeContext.id]);

  const update = useCallback(
    async (key: PersonalizationKey, value: string) => {
      setData(prev => ({ ...prev, [key]: value }));
      await PersonalizationRepo.set(activeContext.id, key, value);
    },
    [activeContext.id]
  );

  return { data, update, loaded };
}
