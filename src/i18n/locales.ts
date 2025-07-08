export type SupportedLocale = 'de-AT' | 'en-US';
export const supportedLocales: SupportedLocale[] = ['de-AT', 'en-US'];

export const getSupportedLocale = (candidate?: string) =>
  supportedLocales.find((x) => x.toLowerCase() === candidate?.toLowerCase());
