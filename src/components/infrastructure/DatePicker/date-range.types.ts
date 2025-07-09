export type DateRange = {
  start?: Date;
  end?: Date;
};

export type DateRangeSelectionId =
  | 'L7D'
  | 'L14D'
  | 'L30D'
  | 'L2M'
  | 'L3M'
  | 'L6M'
  | 'L12M'
  | 'CURR_YEAR' // current year
  | 'PREV_YEAR' // previous year
  | 'L2Y'
  | 'CUSTOM';

export type DateRangeSelection = {
  messageKey: string;
  range: () => DateRange;
};
