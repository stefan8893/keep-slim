export type SupportedLanguage = 'de' | 'en';
export const supportedLanguages: SupportedLanguage[] = ['de', 'en'];

export const getSupportedLanguage = (candidate?: string) =>
  supportedLanguages.find((x) => x.toLowerCase() === candidate?.toLowerCase());
