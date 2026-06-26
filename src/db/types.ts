import { AgeGroupId } from '../data/ageGroups';

export type Tier = 'free' | 'premium' | 'professional';
export type PromptSource = 'official' | 'community' | 'user';
export type TipKind = 'kickstarter' | 'discussion' | 'follow_up' | 'safety_note';
export type TipAudience = 'adult' | 'child' | 'either';

export type Prompt = {
  id: string;
  ageGroup: AgeGroupId;
  categoryId: string | null;
  text: string;
  fullQuestion: string;
  tier: Tier;
  source: PromptSource;
  liminalSpace: string | null;
  parentAskable: boolean;
  isActive: boolean;
  isPlaceholder: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Context = {
  id: string;
  label: string;
  ageGroupDefault: AgeGroupId | null;
  isAnonymous: boolean;
  colorToken: string | null;
  createdAt: string;
  archivedAt: string | null;
};

export type Tip = {
  id: string;
  promptId: string | null;
  kind: TipKind;
  body: string;
  audience: TipAudience;
  displayOrder: number;
  isPlaceholder: boolean;
};

export type WorldBuildingCard = {
  id: string;
  promptId: string;
  cardText: string;
  displayOrder: number;
  difficulty: number;
  isPlaceholder: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  icon: string | null;
  isPlaceholder: boolean;
};

export type LiminalSpace = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  isPlaceholder: boolean;
};
