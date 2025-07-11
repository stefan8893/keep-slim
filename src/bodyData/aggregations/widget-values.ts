import type { BodyData, BoundaryRecords } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/type-helpers';
import { addMonths, differenceInCalendarMonths, getDaysInMonth } from 'date-fns';

export type WidgetValues = {
  latestRecordDateTime: Date;
  latestValue: number;
  change: number;
  averageWeeklyChange: number;
  averageMonthlyChange: number;
};

export const emptyWidgetValues: WidgetValues = {
  latestRecordDateTime: new Date(0),
  latestValue: 0,
  change: 0,
  averageWeeklyChange: 0,
  averageMonthlyChange: 0,
};

function getFirstValue(key: NumberKeys<BodyData>, boundaryRecords: BoundaryRecords) {
  if (boundaryRecords.firstN.length > 1) {
    return (
      boundaryRecords.firstN.reduce((acc, next) => acc + next[key], 0) /
      boundaryRecords.firstN.length
    );
  } else return boundaryRecords.first[key];
}

export function getExactMonthDifference(start: Date, end: Date): number {
  if (start.getTime() === end.getTime()) return 0;

  const isNegative = end < start;
  if (isNegative) return -getExactMonthDifference(end, start);

  const fullMonths = differenceInCalendarMonths(end, start);
  const anchor = addMonths(start, fullMonths);

  const remainingMs = end.getTime() - anchor.getTime();
  const hoursDiff = remainingMs / (1000 * 60 * 60);

  const hoursInMonth = getDaysInMonth(anchor) * 24;

  const fractionalMonth = hoursDiff / hoursInMonth;

  return fullMonths + fractionalMonth;
}

function getExactDayDifference(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
}

function calculateAverageMonthlyChange(
  key: NumberKeys<BodyData>,
  boundaries: BoundaryRecords,
): number {
  const monthsInBetween = getExactMonthDifference(
    boundaries.first.recordedAt,
    boundaries.last.recordedAt,
  );

  const difference = boundaries.last[key] - getFirstValue(key, boundaries);

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

  const difference = boundaries.last[key] - getFirstValue(key, boundaries);

  return Math.abs(difference / (daysInBetween / 7.0));
}

export function calculateWidgetValues(
  key: NumberKeys<BodyData>,
  boundaryRecords?: BoundaryRecords | null,
): WidgetValues {
  if (!boundaryRecords) return emptyWidgetValues;

  const change = boundaryRecords.last[key] - getFirstValue(key, boundaryRecords);
  const averageWeeklyChange = calculateAverageWeeklyChange(key, boundaryRecords);
  const averageMonthlyChange = calculateAverageMonthlyChange(key, boundaryRecords);

  return {
    latestRecordDateTime: boundaryRecords?.last.recordedAt,
    latestValue: boundaryRecords.last[key],
    change: change,
    averageWeeklyChange: averageWeeklyChange,
    averageMonthlyChange: averageMonthlyChange,
  };
}
