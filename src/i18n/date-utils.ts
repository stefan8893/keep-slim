import { useDateLocales } from '@/i18n/useLocales';
import { format } from 'date-fns';

export function formatDate(date: Date, formatString?: string) {
  const dateLocales = useDateLocales();

  return format(date, formatString ?? 'P', { locale: dateLocales.getCurrentLocale() });
}
