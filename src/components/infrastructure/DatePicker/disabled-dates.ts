import { isSameDay } from 'date-fns';

export function isStartDateDisabled(
  date: Date,
  minDate: Date,
  maxDate: Date,
  endDate: Date | undefined | null,
) {
  if (!!endDate && isSameDay(endDate, date)) return false;

  if (!!endDate && date > endDate) return true;

  if (date > maxDate || date < minDate) return true;

  return false;
}

export function isEndDateDisabled(
  date: Date,
  minDate: Date,
  maxDate: Date,
  startDate: Date | undefined | null,
) {
  if (!!startDate && isSameDay(startDate, date)) return false;

  if (!!startDate && date < startDate) return true;

  if (date > maxDate || date < minDate) return true;

  return false;
}
