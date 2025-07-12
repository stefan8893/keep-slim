import { calculateWidgetValues, emptyWidgetValues } from '@/bodyData/aggregations/widget-values';
import type { BoundaryRecords } from '@/bodyData/body-data.types';
import { addDays, parseISO, startOfISOWeek } from 'date-fns';
import { test as baseTest, describe, expect } from 'vitest';

const test = baseTest.extend<{
  boundaryRecordsExactWeek: BoundaryRecords;
}>({
  boundaryRecordsExactWeek: async ({}, use) => {
    const someWeekday = parseISO('2024-07-01');
    const startOfWeek = startOfISOWeek(someWeekday);
    const endOfWeek = startOfISOWeek(addDays(startOfWeek, 7));

    const first = {
      recordedAt: startOfWeek,
      weight: 65,
      muscleMass: 45,
      bodyFat: 13,
      water: 60,
      bmi: 21,
      dailyCalorieRequirement: 2000,
    };

    const last = {
      recordedAt: endOfWeek,
      weight: 64,
      muscleMass: 45.5,
      bodyFat: 13,
      water: 60,
      bmi: 21,
      dailyCalorieRequirement: 2000,
    };

    const boundaryRecords: BoundaryRecords = {
      first,
      firstN: [first],
      last: last,
      lastN: [last],
    };

    use(boundaryRecords);
  },
});

describe('calculateWidgetValues', () => {
  test('returns empty widget values when no boundary records are present', () => {
    const widgetValues = calculateWidgetValues('weight', null);

    expect(widgetValues).toBe(emptyWidgetValues);
  });

  test('returns last weight value from boundary records as latest value', ({
    boundaryRecordsExactWeek,
  }) => {
    const widgetValues = calculateWidgetValues('weight', boundaryRecordsExactWeek);

    expect(widgetValues.latestValue).toBe(boundaryRecordsExactWeek.last.weight);
  });

  test('returns last recorded date as latest record date time', ({ boundaryRecordsExactWeek }) => {
    const widgetValues = calculateWidgetValues('weight', boundaryRecordsExactWeek);

    expect(widgetValues.latestRecordDateTime).toBe(boundaryRecordsExactWeek.last.recordedAt);
  });

  test('returns weight change as the difference between last and first record', ({
    boundaryRecordsExactWeek,
  }) => {
    const widgetValues = calculateWidgetValues('weight', boundaryRecordsExactWeek);

    expect(widgetValues.change).toBe(-1);
  });

  test('returns muscle mass change as the difference between last and first record', ({
    boundaryRecordsExactWeek,
  }) => {
    const widgetValues = calculateWidgetValues('muscleMass', boundaryRecordsExactWeek);

    expect(widgetValues.change).toBe(0.5);
  });

  test('avg weekly change is nearly equal to change when time range is exact one week', ({
    boundaryRecordsExactWeek,
  }) => {
    const widgetValues = calculateWidgetValues('weight', boundaryRecordsExactWeek);

    expect(widgetValues.averageWeeklyChange).toBeCloseTo(1, 5);
  });

  test('returns zero weight change when weight values of first and last record are equal', ({
    boundaryRecordsExactWeek,
  }) => {
    const twoWeeksWithoutWeightChange: BoundaryRecords = {
      first: boundaryRecordsExactWeek.first,
      firstN: [],
      last: {
        ...boundaryRecordsExactWeek.first,
        recordedAt: startOfISOWeek(addDays(boundaryRecordsExactWeek.first.recordedAt, 14)),
        weight: boundaryRecordsExactWeek.first.weight,
      },
      lastN: [],
    };

    const widgetValues = calculateWidgetValues('weight', twoWeeksWithoutWeightChange);

    expect(widgetValues.change).toBeCloseTo(0, 4);
  });

  test('returns zero average weekly weight change when weight values of first and last record are equal', ({
    boundaryRecordsExactWeek,
  }) => {
    const twoWeeksWithoutWeightChange: BoundaryRecords = {
      first: boundaryRecordsExactWeek.first,
      firstN: [],
      last: {
        ...boundaryRecordsExactWeek.first,
        recordedAt: startOfISOWeek(addDays(boundaryRecordsExactWeek.first.recordedAt, 14)),
        weight: boundaryRecordsExactWeek.first.weight,
      },
      lastN: [],
    };

    const widgetValues = calculateWidgetValues('weight', twoWeeksWithoutWeightChange);

    expect(widgetValues.averageWeeklyChange).toBeCloseTo(0, 4);
  });

  test('returns half a kilo average weekly weight change when weight values of first and last record differ by one kilo within two weeks', ({
    boundaryRecordsExactWeek,
  }) => {
    const twoWeeksWithOneKiloWeightGain: BoundaryRecords = {
      first: boundaryRecordsExactWeek.first,
      firstN: [],
      last: {
        ...boundaryRecordsExactWeek.first,
        recordedAt: startOfISOWeek(addDays(boundaryRecordsExactWeek.first.recordedAt, 14)),
        weight: boundaryRecordsExactWeek.first.weight + 1,
      },
      lastN: [],
    };

    const widgetValues = calculateWidgetValues('weight', twoWeeksWithOneKiloWeightGain);

    expect(widgetValues.averageWeeklyChange).toBeCloseTo(0.5, 4);
  });

  test('returns average monthly change of one kilo when time range is whole July and there is one kilo in gain', ({
    boundaryRecordsExactWeek,
  }) => {
    const wholeJuly: BoundaryRecords = {
      first: { ...boundaryRecordsExactWeek.first, recordedAt: parseISO('2025-07-01') },
      firstN: [],
      last: {
        ...boundaryRecordsExactWeek.first,
        recordedAt: parseISO('2025-08-01'),
        weight: boundaryRecordsExactWeek.first.weight + 1,
      },
      lastN: [],
    };

    const widgetValues = calculateWidgetValues('weight', wholeJuly);

    expect(widgetValues.averageMonthlyChange).toBeCloseTo(1, 4);
  });

  test('returns average monthly change of two kilo when time range is the whole July and half of august and there are three kilo in gain', ({
    boundaryRecordsExactWeek,
  }) => {
    const wholeJulyAndHalfOfAugust: BoundaryRecords = {
      first: { ...boundaryRecordsExactWeek.first, recordedAt: parseISO('2025-07-01') },
      firstN: [],
      last: {
        ...boundaryRecordsExactWeek.first,
        recordedAt: parseISO('2025-08-16T12:00:00'),
        weight: boundaryRecordsExactWeek.first.weight + 3,
      },
      lastN: [],
    };

    const widgetValues = calculateWidgetValues('weight', wholeJulyAndHalfOfAugust);

    expect(widgetValues.averageMonthlyChange).toBeCloseTo(2, 4);
  });
});
