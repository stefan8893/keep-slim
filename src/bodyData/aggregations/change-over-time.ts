import { BodyDataInterpolation } from '@/bodyData/aggregations/body-data-interpolation';
import type {
  BodyData,
  BodyDataChange,
  IntervalChangeOverTime as ChangeOverTimeInterval,
  Period,
} from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/helpers.types';
import { identity } from '@vueuse/core';
import { compareAsc } from 'date-fns';

import { MonthlyExactIntervalUtils, WeeklyExactIntervalUtils } from './interval-utils';

export interface IntervalUtils {
  getStartOfNextInterval(date: Date): Date;

  differenceInInterval(start: Date, end: Date): number;

  endOfInterval(date: Date): Date;
  addInterval(date: Date, count: number): Date;

  getIntervalIdentifier(date: Date): string;

  createPeriod(identifier: string, range: Date[]): Period;
}

function determineTimePeriods(intervalUtis: IntervalUtils, bodyData: BodyData[]): Period[] {
  const firstRecord = bodyData[0];

  const startPoint = intervalUtis.getStartOfNextInterval(firstRecord.recordedAt);
  const endPoint = bodyData.at(-1)!.recordedAt;

  if (startPoint > endPoint) return [];

  const pointsInBetween = intervalUtis.differenceInInterval(endPoint, startPoint);

  const flatInterpolationPoints = Array.from(Array(pointsInBetween).keys())
    .map((x) => {
      return [
        intervalUtis.addInterval(intervalUtis.endOfInterval(startPoint), x),
        intervalUtis.addInterval(startPoint, x + 1),
      ];
    })
    .flatMap(identity);

  const periods = Object.groupBy([startPoint, ...flatInterpolationPoints, endPoint], (x) =>
    intervalUtis.getIntervalIdentifier(x),
  );

  return Object.keys(periods)
    .map((key: string) => intervalUtis.createPeriod(key, periods[key]!))
    .sort((a, b) => compareAsc(a.range.start, b.range.start));
}

export function calculateChangeOverTime(
  interval: ChangeOverTimeInterval,
  property: NumberKeys<BodyData>,
  bodyData: BodyData[],
): BodyDataChange[] {
  if (bodyData.length < 2) return [];

  const intervalUtils =
    interval === 'weeklyExact' ? new WeeklyExactIntervalUtils() : new MonthlyExactIntervalUtils();

  const interpolation = new BodyDataInterpolation(bodyData);

  return determineTimePeriods(intervalUtils, bodyData).map((x) => {
    const valueAtStart = interpolation.at(x.range.start, property)?.value;
    const valueAtEnd = interpolation.at(x.range.end, property)?.value;

    if (!valueAtStart) throw Error(`Couldn't interpolate the value at the start date.`);
    if (!valueAtEnd) throw Error(`Couldn't interpolate the value at the end date.`);

    return {
      start: x.range.start,
      end: x.range.end,
      interval: interval,
      property: property,
      value: valueAtEnd - valueAtStart,
    };
  });
}
