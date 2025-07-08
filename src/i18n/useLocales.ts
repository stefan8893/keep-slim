import { useLocaleStore } from '@/stores/localeStore';
import { type Locale, deAT, enUS } from 'date-fns/locale';
import { default as elPlus_de } from 'element-plus/es/locale/lang/de';
import { default as elPlus_en } from 'element-plus/es/locale/lang/en';

export function useDateLocales() {
  const localeStore = useLocaleStore();
  const supportedLocales = [deAT, enUS];

  const getLocale = (code: string): Locale => {
    const codeWithEnglishFallback = code === 'en' ? 'en-US' : code;

    const found = supportedLocales.find((x) => x.code === codeWithEnglishFallback);

    if (!found) {
      const supportedLocaleCodes = supportedLocales.map((x) => x.code);
      supportedLocaleCodes.push('en');

      throw Error(
        `The locale '${code}' is not supported. Only '${supportedLocaleCodes.join("', '")}'`,
      );
    }

    return found;
  };

  const getCurrentLocale = () => getLocale(localeStore.locale);

  return {
    supportedLocales,
    getLocale,
    getCurrentLocale,
  };
}

export function useElementPlusLocales() {
  const supportedLocales = [elPlus_de, elPlus_en];

  const get = (code: string) => {
    const found = supportedLocales.find((x) => x.name === code);

    if (!found) {
      const supportedLocaleCodes = supportedLocales.map((x) => x.name);

      throw Error(
        `The locale '${code}' is not supported. Only '${supportedLocaleCodes.join("', '")}'`,
      );
    }

    return found;
  };

  return {
    supportedLocales,
    get,
  };
}
