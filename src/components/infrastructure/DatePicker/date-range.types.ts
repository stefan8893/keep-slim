import type { MessageKey } from '@/i18n/message-keys.g';

export type DateRange = {
  start: Date | undefined | null;
  end: Date | undefined | null;
};

export const emptyDateRange: DateRange = {
  start: null,
  end: null,
};

export type DateRangeSelectionId =
  | 'L7D'
  | 'L14D'
  | 'L30D'
  | 'L2M'
  | 'L3M'
  | 'L6M'
  | 'L12M'
  | 'CURR_YEAR'
  | 'PREV_YEAR'
  | 'L2Y'
  | 'CUSTOM';

export type DateRangeSelection = {
  messageKey: MessageKey;
  range: () => DateRange;
};
