import { BodyDataInterpolation } from '@/bodyData/aggregations/body-data-interpolation';
import type { BodyData, BodyDataChange, Interval } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/type-helpers';
import { identity } from '@vueuse/core';
import {
  addMonths,
  addWeeks,
  compareAsc,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  endOfISOWeek,
  endOfMonth,
  getISOWeek,
  getMonth,
  startOfISOWeek,
  startOfMonth,
} from 'date-fns';

type TimeRange = {
  start: Date;
  end: Date;
};

type MonthlyPeriod = {
  type: 'weeklyExact';
  isoWeek: number;
  range: TimeRange;
};

type WeeklyPeriod = {
  type: 'monthlyExact';
  month: number;
  range: TimeRange;
};

type Period = WeeklyPeriod | MonthlyPeriod;

function createPeriod(interval: Interval, monthWeek: string, range: Date[]): Period {
  if (interval === 'weeklyExact') {
    return {
      type: 'weeklyExact',
      isoWeek: Number(monthWeek),
      range: {
        start: range[0],
        end: range[1],
      },
    };
  } else {
    return {
      type: 'monthlyExact',
      month: Number(monthWeek),
      range: {
        start: range[0],
        end: range[1],
      },
    };
  }
}

function determineTimePeriods(interval: Interval, bodyData: BodyData[]): Period[] {
  const firstRecord = bodyData[0];

  const startPoint =
    interval === 'weeklyExact'
      ? startOfISOWeek(addWeeks(firstRecord.recordedAt, 1))
      : startOfMonth(addMonths(firstRecord.recordedAt, 1));

  const endPoint = bodyData.at(-1)!.recordedAt;

  const pointsInBetween =
    interval === 'weeklyExact'
      ? differenceInCalendarISOWeeks(endPoint, startPoint)
      : differenceInCalendarMonths(endPoint, startPoint);

  const flatInterpolationPoints = Array.from(Array(pointsInBetween).keys())
    .map((x) => {
      if (interval === 'weeklyExact')
        return [addWeeks(endOfISOWeek(startPoint), x), addWeeks(startPoint, x + 1)];
      else return [addMonths(endOfMonth(startPoint), x), addMonths(startPoint, x + 1)];
    })
    .flatMap(identity);

  const periods = Object.groupBy([startPoint, ...flatInterpolationPoints, endPoint], (x) =>
    interval === 'weeklyExact' ? getISOWeek(x) : getMonth(x) + 1,
  );

  return Object.keys(periods)
    .map((key: string) => createPeriod(interval, key, periods[Number(key)]!))
    .sort((a, b) => compareAsc(a.range.start, b.range.start));
}

export function calculateChangeOverTime(
  interval: Interval,
  property: NumberKeys<BodyData>,
  bodyData: BodyData[],
): BodyDataChange[] {
  if (bodyData.length < 1) return [];

  const interpolation = new BodyDataInterpolation(bodyData);

  return determineTimePeriods(interval, bodyData).map((x) => {
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
