import { PersonalizationData } from '../db/repositories/personalization';

// Tokens we recognize in prompt text. When the user has filled in their
// personalization (per active context), tokens get substituted. Otherwise
// they fall back to neutral phrasings so the prompt remains readable.
const FALLBACKS: Record<string, string> = {
  '{name}': 'a friend',
  '{location}': 'your town',
  '{interest}': 'something you love',
};

export function applyTokens(text: string, data: PersonalizationData): string {
  return text
    .replace(/\{name\}/g, data.name?.trim() || FALLBACKS['{name}'])
    .replace(/\{location\}/g, data.location?.trim() || FALLBACKS['{location}'])
    .replace(/\{interest\}/g, data.interest?.trim() || FALLBACKS['{interest}']);
}
