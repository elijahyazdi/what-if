import { useEffect, useState } from 'react';
import { LiminalSpaceRepo } from '../db/repositories/liminalSpaces';
import { LiminalSpace } from '../db/types';

export function useLiminalSpaces(): LiminalSpace[] {
  const [spaces, setSpaces] = useState<LiminalSpace[]>([]);
  useEffect(() => {
    LiminalSpaceRepo.list().then(setSpaces);
  }, []);
  return spaces;
}
