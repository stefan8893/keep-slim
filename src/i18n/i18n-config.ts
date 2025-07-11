import de from '@/i18n/resources/de.json';
import en from '@/i18n/resources/en.json';
import { createI18n } from 'vue-i18n';

type MessageSchema = typeof de;

export type NumberFormat = 'weight' | 'decimal' | 'percent';

export default createI18n<[MessageSchema], 'de-AT' | 'en-US'>({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    'de-AT': de,
    'en-US': en,
  },
  numberFormats: {
    'de-AT': {
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
      weight: {
        style: 'unit',
        unit: 'kilogram',
        unitDisplay: 'short',
      },
    },
    'en-US': {
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
      weight: {
        style: 'unit',
        unit: 'kilogram',
        unitDisplay: 'short',
        maximumFractionDigits: 1,
      },
    },
  },
});
