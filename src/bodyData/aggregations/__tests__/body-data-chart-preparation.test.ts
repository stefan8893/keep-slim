import { prepareBodyDataForChart } from '@/bodyData/aggregations/body-data-chart-preparation';
import type {
  BodyData,
  BodyDataSummarizedByDay,
  BodyDataSummarizedByWeek,
} from '@/bodyData/body-data.types';
import { addHours, compareAsc, parseISO } from 'date-fns';
import { describe, expect, test } from 'vitest';

import { createBodyDataRecordWith, endOfAugustWith, startOfJulyWith } from './test-infrastructure';
import { getTestData } from './testData/body-data';

describe('prepareBodyDataForChart', () => {
  test('returns an empty array when there is no data given to the function and the inteval is "dailyExact"', () => {
    const preparedForChart = prepareBodyDataForChart([]);

    expect(preparedForChart.result).toHaveLength(0);
  });

  test('returns an empty array when there is no data given to the function and the inteval is "weeklyExact"', () => {
    const preparedForChart = prepareBodyDataForChart([]);

    expect(preparedForChart.result).toHaveLength(0);
  });

  test('returns one item with type "summarizedByDay" when only one item was given', () => {
    const startOfJuly = startOfJulyWith('weight', 66);

    const preparedForChart = prepareBodyDataForChart([startOfJuly]);

    expect(preparedForChart.result).toHaveLength(1);
    expect(preparedForChart.type).toBe('summarizedByDay');
  });

  test('returns one item without summarization when only one item was given', () => {
    const startOfJuly = startOfJulyWith('weight', 66);

    const preparedForChart = prepareBodyDataForChart([startOfJuly]);

    expect(preparedForChart.result).toHaveLength(1);
    expect(preparedForChart.type).toBe('summarizedByDay');
    const summarizedByDay = preparedForChart as BodyDataSummarizedByDay;
    expect(summarizedByDay.result.at(0)!.day).toEqual(startOfJuly.recordedAt);
    expect(summarizedByDay.result.at(0)!.values.weight).toBeTruthy();
    expect(summarizedByDay.result.at(0)!.values.weight?.value).toBe(66);
    expect(summarizedByDay.result.at(0)!.values.weight?.count).toBe(1);
  });

  test('returns two items without summarization when having two records on different days', () => {
    const startOfJuly = startOfJulyWith('weight', 66);
    const endOfAugust = endOfAugustWith('weight', 67);

    const preparedForChart = prepareBodyDataForChart([startOfJuly, endOfAugust]);

    expect(preparedForChart.result).toHaveLength(2);
    expect(preparedForChart.result.at(0)!.values.weight).toBeTruthy();
    expect(preparedForChart.result.at(0)!.values.weight?.value).toBe(startOfJuly.weight);
    expect(preparedForChart.result.at(0)!.values.weight?.count).toBe(1);

    expect(preparedForChart.result.at(1)!.values.weight).toBeTruthy();
    expect(preparedForChart.result.at(1)!.values.weight?.value).toBe(endOfAugust.weight);
    expect(preparedForChart.result.at(1)!.values.weight?.count).toBe(1);
  });

  test('returns one item with summarization when having two records on the same day', () => {
    const startOfJuly = startOfJulyWith('weight', 66);
    const startOfJulyOneHourLater = createBodyDataRecordWith({
      recordedAt: addHours(startOfJuly.recordedAt, 1),
      weight: 67,
    });

    const preparedForChart = prepareBodyDataForChart([startOfJuly, startOfJulyOneHourLater]);

    expect(preparedForChart.result).toHaveLength(1);
    expect(preparedForChart.result.at(0)!.values.weight).toBeTruthy();
    expect(preparedForChart.result.at(0)!.values.weight?.value).toBe(66.5);
    expect(preparedForChart.result.at(0)!.values.weight?.count).toBe(2);
  });

  test('returns one item with correct average values when having two records on the same day', () => {
    const firstOfJulyNoon: BodyData = createBodyDataRecordWith({
      recordedAt: parseISO('2025-07-01T12:00:00'),
      weight: 65,
      muscleMass: 45,
      bodyFat: 13,
      water: 60,
    });
    const firstOfJulyEvening: BodyData = createBodyDataRecordWith({
      recordedAt: parseISO('2025-07-01T18:00:00'),
      weight: 66,
      muscleMass: 46,
      bodyFat: 14,
      water: 61,
    });

    const preparedForChart = prepareBodyDataForChart([firstOfJulyNoon, firstOfJulyEvening]);

    expect(preparedForChart.result).toHaveLength(1);
    expect(preparedForChart.result.at(0)!.values.weight?.value).toBe(65.5);
    expect(preparedForChart.result.at(0)!.values.weight?.count).toBe(2);
    expect(preparedForChart.result.at(0)!.values.muscleMass?.value).toBe(45.5);
    expect(preparedForChart.result.at(0)!.values.muscleMass?.count).toBe(2);
    expect(preparedForChart.result.at(0)!.values.bodyFat?.value).toBe(13.5);
    expect(preparedForChart.result.at(0)!.values.bodyFat?.count).toBe(2);
    expect(preparedForChart.result.at(0)!.values.water?.value).toBe(60.5);
    expect(preparedForChart.result.at(0)!.values.water?.count).toBe(2);
  });

  test('returns one item with correct date summarization when having two records on the same day', () => {
    const first = createBodyDataRecordWith({ recordedAt: parseISO('2025-07-01T10:00:00') });
    const second = createBodyDataRecordWith({ recordedAt: parseISO('2025-07-01T14:00:00') });

    const preparedForChart = prepareBodyDataForChart([first, second]);

    expect(preparedForChart.result).toHaveLength(1);
    expect(preparedForChart.type).toBe('summarizedByDay');
    const summarizedByDay = preparedForChart as BodyDataSummarizedByDay;
    expect(summarizedByDay.result.at(0)!.day).toEqual(parseISO('2025-07-01T12:00:00'));
  });

  test('returns summarized items by week when having plenty of data', () => {
    const preparedForChart = prepareBodyDataForChart(getTestData());

    expect(preparedForChart.result).toHaveLength(44);
    expect(preparedForChart.type).toBe('summarizedByWeek');
  });

  test('returns correct summarized by week for week 6', () => {
    const preparedForChart = prepareBodyDataForChart(getTestData());

    expect(preparedForChart.type).toBe('summarizedByWeek');
    const summarizedByWeek = preparedForChart as BodyDataSummarizedByWeek;
    const week6 = summarizedByWeek.result.find(
      (x) => compareAsc(x.firstDayOfWeek, parseISO('2025-02-03T00:00:00')) === 0,
    );
    expect(week6).toBeTruthy();

    expect(week6?.values.weight.count).toBe(7);
    expect(week6?.values.weight.value).toBeCloseTo(66.2);
  });
});
