import { type SupportedLanguage, getSupportedLanguage } from '@/i18n/languages';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { type Ref, ref, watch } from 'vue';

export const defaultLanguage: SupportedLanguage = 'de';

const languageInLocalStorage = useStorage<SupportedLanguage | undefined>(
  'language',
  undefined,
  localStorage,
);

export const useLanguageStore = defineStore('language', () => {
  const language: Ref<SupportedLanguage> = ref(getInitialLanguage());

  watch(language, () => {
    languageInLocalStorage.value = language.value;
  });

  return { language };
});

function getInitialLanguage(): SupportedLanguage {
  if (!!languageInLocalStorage.value) return languageInLocalStorage.value;

  const browserLanguage = new Intl.Locale(navigator.language).language;
  const supportedBrowserLanguage = getSupportedLanguage(browserLanguage);

  if (!!supportedBrowserLanguage) return supportedBrowserLanguage;

  return defaultLanguage;
}
