import { useDateLocales } from '@/i18n/useLocales';
import { format } from 'date-fns';

function formatInternal(date: Date, formatString: string) {
  const dateLocales = useDateLocales();

  return format(date, formatString ?? 'P', { locale: dateLocales.getCurrentLocale() });
}

export function formatDate(date: Date, formatString?: string) {
  return formatInternal(date, formatString ?? 'P');
}

export function formatDateTime(date: Date, formatString?: string) {
  return formatInternal(date, formatString ?? 'Pp');
}
