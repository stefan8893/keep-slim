import type {
  DateRangeSelection,
  DateRangeSelectionId,
} from '@/components/infrastructure/DatePicker/date-range.types';
import { MessageKey } from '@/i18n/message-keys.g';
import {
  endOfDay,
  endOfYear,
  startOfDay,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

export const dateRangeSelections: Map<DateRangeSelectionId, DateRangeSelection> = new Map([
  [
    'L7D',
    {
      messageKey: MessageKey.last7Days,
      range: () => {
        const start = startOfDay(subDays(new Date(), 6));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'L14D',
    {
      messageKey: MessageKey.last14Days,
      range: () => {
        const start = startOfDay(subDays(new Date(), 13));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'L30D',
    {
      messageKey: MessageKey.last30Days,
      range: () => {
        const start = startOfDay(subDays(new Date(), 29));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'L2M',
    {
      messageKey: MessageKey.last2Months,
      range: () => {
        const start = startOfDay(subMonths(new Date(), 2));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'L3M',
    {
      messageKey: MessageKey.last3Months,
      range: () => {
        const start = startOfDay(subMonths(new Date(), 3));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'L6M',
    {
      messageKey: MessageKey.last6Months,
      range: () => {
        const start = startOfDay(subMonths(new Date(), 6));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'L12M',
    {
      messageKey: MessageKey.last12Months,
      range: () => {
        const start = startOfDay(subMonths(new Date(), 12));
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'CURR_YEAR',
    {
      messageKey: MessageKey.currentYear,
      range: () => {
        const start = startOfYear(new Date());
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'PREV_YEAR',
    {
      messageKey: MessageKey.previousYear,
      range: () => {
        const oneYearAgo = subYears(new Date(), 1);

        const start = startOfYear(oneYearAgo);
        const end = endOfYear(oneYearAgo);

        return { start, end };
      },
    },
  ],
  [
    'L2Y',
    {
      messageKey: MessageKey.last2Years,
      range: () => {
        const start = subYears(new Date(), 2);
        const end = endOfDay(new Date());
        return { start, end };
      },
    },
  ],
  [
    'CUSTOM',
    {
      messageKey: MessageKey.selectDateRange,
      range: () => ({ start: undefined, end: undefined }),
    },
  ],
]);
