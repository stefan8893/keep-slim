import { type SupportedLocale, getSupportedLocale } from '@/i18n/locales';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { type Ref, computed, ref, watch } from 'vue';

export const defaultLocale: SupportedLocale = 'de-AT';

const localeInLocalStorage = useStorage<SupportedLocale | undefined>(
  'locale',
  undefined,
  localStorage,
);

export const useLocaleStore = defineStore('locale', () => {
  const locale: Ref<SupportedLocale> = ref(getInitialLocale());

  watch(locale, () => {
    localeInLocalStorage.value = locale.value;
  });

  const language = computed(() => locale.value.split('-')[0]);
  const country = computed(() => locale.value.split('-')[1]);

  return {
    locale,
    language,
    country,
  };
});

function getInitialLocale(): SupportedLocale {
  if (!!localeInLocalStorage.value) return localeInLocalStorage.value;

  const browserLanguage = new Intl.Locale(navigator.language).baseName;
  const supportedBrowserLanguage = getSupportedLocale(browserLanguage);

  if (!!supportedBrowserLanguage) return supportedBrowserLanguage;

  return defaultLocale;
}
