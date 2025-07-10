import type { NumberFormat } from '@/i18n/i18n-config';

export type WidgetOptions = {
  numberFormat: NumberFormat;
  color: string;
  minValue: number;
  maxValue: number;
};

export type WidgetValues = {
  latestRecordDateTime: Date;
  latestValue: number;
  changeInSelectedTimeRange: number;
  weeklyAverageChange: number;
};
