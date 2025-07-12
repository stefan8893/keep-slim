import { createBodyDataRecord } from '@/bodyData/aggregations/__tests__/test-infrastructure';
import { calculateChangeOverTime } from '@/bodyData/aggregations/change-over-time';
import type { BodyData } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/type-helpers';
import { addWeeks, endOfDay, endOfISOWeek, parseISO } from 'date-fns';
import { describe, expect, test } from 'vitest';

import { getTestData } from './testData/body-data';

describe('calculateChangeOverTime', function () {
  test('returns an empty array when passing no body data records', function () {
    const change = calculateChangeOverTime('weeklyExact', 'weight', []);

    expect(change).toHaveLength(0);
  });

  test('returns the correct change of an exact week', function () {
    const sundayNoon = createBodyDataRecord(parseISO('2025-07-06T12:00:00'), 'weight', 66);
    const mondayNoon = createBodyDataRecord(parseISO('2025-07-07T12:00:00'), 'weight', 67);

    const sundayNoonNextWeek = createBodyDataRecord(
      addWeeks(sundayNoon.recordedAt, 1),
      'weight',
      67,
    );
    const mondayNoonNextweek = createBodyDataRecord(
      addWeeks(mondayNoon.recordedAt, 1),
      'weight',
      68,
    );

    const bodyDataRecords = [sundayNoon, mondayNoon, sundayNoonNextWeek, mondayNoonNextweek];

    const change = calculateChangeOverTime('weeklyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[0].value).toBeCloseTo(1, 4);
  });

  test('returns the correct change of a begun week', function () {
    const sundayNoon = createBodyDataRecord(parseISO('2025-07-06T12:00:00'), 'weight', 66);
    const mondayNoon = createBodyDataRecord(parseISO('2025-07-07T12:00:00'), 'weight', 67);

    const sundayNoonNextWeek = createBodyDataRecord(
      addWeeks(sundayNoon.recordedAt, 1),
      'weight',
      67,
    );
    const mondayNoonNextweek = createBodyDataRecord(
      addWeeks(mondayNoon.recordedAt, 1),
      'weight',
      68,
    );

    const bodyDataRecords = [sundayNoon, mondayNoon, sundayNoonNextWeek, mondayNoonNextweek];

    const change = calculateChangeOverTime('weeklyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[1].value).toBeCloseTo(0.5, 4);
  });

  test('returns the correct change of an exact month', function () {
    const endOfJune = createBodyDataRecord(parseISO('2025-06-30T12:00:00'), 'weight', 66);
    const startOfJuly = createBodyDataRecord(parseISO('2025-07-01T12:00:00'), 'weight', 67);

    const endOfJuly = createBodyDataRecord(parseISO('2025-07-31T12:00:00'), 'weight', 67);
    const startOfAugust = createBodyDataRecord(parseISO('2025-08-01T12:00:00'), 'weight', 68);

    const bodyDataRecords = [endOfJune, startOfJuly, endOfJuly, startOfAugust];

    const change = calculateChangeOverTime('monthlyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[0].value).toBeCloseTo(1, 4);
  });

  test('returns the correct change of a begun month', function () {
    const endOfJune = createBodyDataRecord(parseISO('2025-06-30T12:00:00'), 'weight', 66);
    const startOfJuly = createBodyDataRecord(parseISO('2025-07-01T12:00:00'), 'weight', 67);

    const endOfJuly = createBodyDataRecord(parseISO('2025-07-31T12:00:00'), 'weight', 67);
    const startOfAugust = createBodyDataRecord(parseISO('2025-08-01T12:00:00'), 'weight', 68);

    const bodyDataRecords = [endOfJune, startOfJuly, endOfJuly, startOfAugust];

    const change = calculateChangeOverTime('monthlyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[1].value).toBeCloseTo(0.5, 4);
  });

  test('returns the correct change of an exact month when weight were loss -> negative change', function () {
    const endOfJune = createBodyDataRecord(parseISO('2025-06-30T12:00:00'), 'weight', 66);
    const startOfJuly = createBodyDataRecord(parseISO('2025-07-01T12:00:00'), 'weight', 67);

    const endOfJuly = createBodyDataRecord(parseISO('2025-07-31T12:00:00'), 'weight', 65);
    const startOfAugust = createBodyDataRecord(parseISO('2025-08-01T12:00:00'), 'weight', 66);

    const bodyDataRecords = [endOfJune, startOfJuly, endOfJuly, startOfAugust];

    const change = calculateChangeOverTime('monthlyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[0].value).toBeCloseTo(-1, 4);
  });

  test('returns the correct time range for the change of an exact week', function () {
    const sundayNoon = createBodyDataRecord(parseISO('2025-07-06T12:00:00'), 'weight', 66);
    const mondayNoon = createBodyDataRecord(parseISO('2025-07-07T12:00:00'), 'weight', 67);

    const sundayNoonNextWeek = createBodyDataRecord(
      addWeeks(sundayNoon.recordedAt, 1),
      'weight',
      67,
    );
    const mondayNoonNextweek = createBodyDataRecord(
      addWeeks(mondayNoon.recordedAt, 1),
      'weight',
      68,
    );

    const bodyDataRecords = [sundayNoon, mondayNoon, sundayNoonNextWeek, mondayNoonNextweek];

    const change = calculateChangeOverTime('weeklyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[0].start).toEqual(parseISO('2025-07-07T00:00:00'));
    expect(change[0].end).toEqual(endOfISOWeek(parseISO('2025-07-07T00:00:00')));
  });

  test('returns the correct time range for the change of an exact month', function () {
    const endOfJune = createBodyDataRecord(parseISO('2025-06-30T12:00:00'), 'weight', 66);
    const startOfJuly = createBodyDataRecord(parseISO('2025-07-01T12:00:00'), 'weight', 67);

    const endOfJuly = createBodyDataRecord(parseISO('2025-07-31T12:00:00'), 'weight', 67);
    const startOfAugust = createBodyDataRecord(parseISO('2025-08-01T12:00:00'), 'weight', 68);

    const bodyDataRecords = [endOfJune, startOfJuly, endOfJuly, startOfAugust];

    const change = calculateChangeOverTime('monthlyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[0].start).toEqual(parseISO('2025-07-01T00:00:00'));
    expect(change[0].end).toEqual(endOfDay(parseISO('2025-07-31T00:00:00')));
  });

  test('returns the correct property for the change of an exact week', function () {
    const sundayNoon = createBodyDataRecord(parseISO('2025-07-06T12:00:00'), 'muscleMass', 45);
    const mondayNoon = createBodyDataRecord(parseISO('2025-07-07T12:00:00'), 'muscleMass', 46);

    const sundayNoonNextWeek = createBodyDataRecord(
      addWeeks(sundayNoon.recordedAt, 1),
      'muscleMass',
      46,
    );
    const mondayNoonNextweek = createBodyDataRecord(
      addWeeks(mondayNoon.recordedAt, 1),
      'muscleMass',
      46,
    );

    const bodyDataRecords = [sundayNoon, mondayNoon, sundayNoonNextWeek, mondayNoonNextweek];

    const change = calculateChangeOverTime('weeklyExact', 'muscleMass', bodyDataRecords);

    const property: NumberKeys<BodyData> = 'muscleMass';
    expect(change).toHaveLength(2);
    expect(change[0].property).toEqual(property);
  });

  test('works for turn of the year', function () {
    const endOfNovember = createBodyDataRecord(parseISO('2024-11-30T12:00:00'), 'weight', 66);
    const startODecember = createBodyDataRecord(parseISO('2024-12-01T12:00:00'), 'weight', 67);

    const endOfDecember = createBodyDataRecord(parseISO('2024-12-31T12:00:00'), 'weight', 67);
    const startOfJanuary = createBodyDataRecord(parseISO('2025-01-01T12:00:00'), 'weight', 68);

    const bodyDataRecords = [endOfNovember, startODecember, endOfDecember, startOfJanuary];

    const change = calculateChangeOverTime('monthlyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(2);
    expect(change[0].start).toEqual(parseISO('2024-12-01T00:00:00'));
    expect(change[0].end).toEqual(endOfDay(parseISO('2024-12-31T00:00:00')));
  });

  test('works for plenty of data as well for exact monthly changes', function () {
    const bodyDataRecords = getTestData();

    const change = calculateChangeOverTime('monthlyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(10);
  });

  test('works for plenty of data as well for exact weekly changes', function () {
    const bodyDataRecords = getTestData();

    const change = calculateChangeOverTime('weeklyExact', 'weight', bodyDataRecords);

    expect(change).toHaveLength(43);
  });
});
