import { useLocaleStore } from '@/stores/localeStore';
import { type Locale, deAT, enUS } from 'date-fns/locale';
import { default as elPlus_de } from 'element-plus/es/locale/lang/de';
import { default as elPlus_en } from 'element-plus/es/locale/lang/en';

export function useDateLocales() {
  const localeStore = useLocaleStore();
  const supportedLocales = [deAT, enUS];

  const getLocale = (code: string): Locale => {
    const found = supportedLocales.find((x) => x.code === code);

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

  const getDateFormatString = (locale: string) => {
    const dummyDate = new Date(2025, 0, 2);
    const parts = new Intl.DateTimeFormat(locale).formatToParts(dummyDate);

    return parts
      .map((part) => {
        switch (part.type) {
          case 'day':
            return 'dd';
          case 'month':
            return 'MM';
          case 'year':
            return 'yyyy';
          default:
            return part.value;
        }
      })
      .join('')
      .toUpperCase();
  };

  return {
    supportedLocales,
    getDateFormatString,
    get,
  };
}
