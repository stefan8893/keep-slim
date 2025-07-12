import type { BodyData, BoundaryRecords } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/type-helpers';
import {
  compareAsc,
  differenceInCalendarMonths,
  endOfMonth,
  getDaysInMonth,
  startOfMonth,
} from 'date-fns';

export type Empty = {
  state: 'empty';
};

export type SingleDay = {
  state: 'singleDay';
  recordedAt: Date;
  value: number;
};

export type Range = {
  state: 'range';
  oldestRecordDateTime: Date;
  latestRecordDateTime: Date;
  latestValue: number;
  change: number;
  averageWeeklyChange: number;
  averageMonthlyChange: number;
};

export type WidgetValues = Empty | SingleDay | Range;

function average(numbers: number[]) {
  return numbers.reduce((acc, next) => acc + next, 0) / numbers.length;
}

function getFirstValue(key: NumberKeys<BodyData>, boundaryRecords: BoundaryRecords): number {
  return boundaryRecords.firstN.length === 1
    ? boundaryRecords.firstN[0][key]
    : average(boundaryRecords.firstN.map((x) => x[key]));
}

function getLastValue(key: NumberKeys<BodyData>, boundaryRecords: BoundaryRecords): number {
  return boundaryRecords.lastN.length === 1
    ? boundaryRecords.lastN[0][key]
    : average(boundaryRecords.lastN.map((x) => x[key]));
}

function getExactDayDifference(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
}

export function getExactMonthDifference(start: Date, end: Date): number {
  if (start === end) return 0;

  if (end < start) return getExactMonthDifference(end, start);

  const startEndOfMonth = endOfMonth(start);
  const endStartOfMonth = startOfMonth(end);

  const daysInMonthOfStartDate = getDaysInMonth(start);
  const daysToCountInMonthOfStartDate = getExactDayDifference(start, startEndOfMonth);

  const wholeMonthsInBetween = differenceInCalendarMonths(endStartOfMonth, startEndOfMonth) - 1;

  const daysInMonthOfEndDate = getDaysInMonth(end);
  const daysToCountInMonthOfEndDate = getExactDayDifference(endStartOfMonth, end);

  return (
    daysToCountInMonthOfStartDate / daysInMonthOfStartDate +
    wholeMonthsInBetween +
    daysToCountInMonthOfEndDate / daysInMonthOfEndDate
  );
}

function calculateAverageMonthlyChange(
  key: NumberKeys<BodyData>,
  boundaries: BoundaryRecords,
): number {
  const monthsInBetween = getExactMonthDifference(
    boundaries.first.recordedAt,
    boundaries.last.recordedAt,
  );

  const difference = getLastValue(key, boundaries) - getFirstValue(key, boundaries);

  return Math.abs(difference / monthsInBetween);
}

function calculateAverageWeeklyChange(
  key: NumberKeys<BodyData>,
  boundaries: BoundaryRecords,
): number {
  const daysInBetween = getExactDayDifference(
    boundaries.first.recordedAt,
    boundaries.last.recordedAt,
  );

  const difference = getLastValue(key, boundaries) - getFirstValue(key, boundaries);

  return Math.abs(difference / (daysInBetween / 7));
}

export function calculateWidgetValues(
  key: NumberKeys<BodyData>,
  boundaryRecords?: BoundaryRecords | null,
): WidgetValues {
  if (!boundaryRecords) return { state: 'empty' };

  if (compareAsc(boundaryRecords.first.recordedAt, boundaryRecords.last.recordedAt) === 0)
    return {
      state: 'singleDay',
      recordedAt: boundaryRecords.last.recordedAt,
      value: boundaryRecords.last[key],
    };

  const change = getLastValue(key, boundaryRecords) - getFirstValue(key, boundaryRecords);
  const averageWeeklyChange = calculateAverageWeeklyChange(key, boundaryRecords);
  const averageMonthlyChange = calculateAverageMonthlyChange(key, boundaryRecords);

  return {
    state: 'range',
    oldestRecordDateTime: boundaryRecords.first.recordedAt,
    latestRecordDateTime: boundaryRecords.last.recordedAt,
    latestValue: boundaryRecords.last[key],
    change: change,
    averageWeeklyChange: averageWeeklyChange,
    averageMonthlyChange: averageMonthlyChange,
  };
}
