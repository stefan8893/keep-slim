import de from '@/i18n/resources/de.json';
import en from '@/i18n/resources/en.json';
import { createI18n } from 'vue-i18n';

type MessageSchema = typeof de;

export default createI18n<[MessageSchema], 'de' | 'en'>({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    de,
    en,
  },
});
