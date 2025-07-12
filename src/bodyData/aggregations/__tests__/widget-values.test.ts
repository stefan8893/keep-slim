import {
  endOfAugustWith,
  endOfJulyWith,
  midAugustWith,
  startOfJulyWith,
  toBoundaryRecords,
} from '@/bodyData/aggregations/__tests__/test-infrastructure';
import {
  type Range,
  type SingleDay,
  calculateWidgetValues,
} from '@/bodyData/aggregations/widget-values';
import { describe, expect, test } from 'vitest';

describe('calculateWidgetValues', () => {
  test('returns the correct average monthly weight change', () => {
    const boundaries = toBoundaryRecords(
      startOfJulyWith('weight', 66),
      endOfJulyWith('weight', 65),
    );

    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('range');
    const range = widgetValues as Range;
    expect(range.averageMonthlyChange).toBeCloseTo(1, 4);
  });

  test('returns the correct average weekly weight change', () => {
    const boundaries = toBoundaryRecords(
      startOfJulyWith('weight', 66),
      endOfJulyWith('weight', 65),
    );

    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('range');
    const range = widgetValues as Range;
    expect(range.averageWeeklyChange).toBeCloseTo(0.2258, 4);
  });

  test('average monthly weight change is equal to change when time range is one month', () => {
    const boundaries = toBoundaryRecords(
      startOfJulyWith('weight', 66),
      endOfJulyWith('weight', 65),
    );

    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('range');
    const range = widgetValues as Range;
    const changeAbsolute = Math.abs(range.averageMonthlyChange);
    expect(range.averageMonthlyChange).toBeCloseTo(changeAbsolute, 4);
  });

  test('returns the correct total wheight change', () => {
    const boundaries = toBoundaryRecords(
      startOfJulyWith('weight', 66),
      endOfJulyWith('weight', 65),
    );

    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('range');
    const range = widgetValues as Range;
    expect(range.change).toBeCloseTo(-1, 4);
  });

  test('average monthly weight change is respecting months exactly', () => {
    const boundaries = toBoundaryRecords(
      startOfJulyWith('weight', 66),
      midAugustWith('weight', 67.5),
    );

    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('range');
    const range = widgetValues as Range;
    expect(range.averageMonthlyChange).toBeCloseTo(1, 4);
  });

  test('average monthly muscle mass change is respecting months exactly', () => {
    const boundaries = toBoundaryRecords(
      startOfJulyWith('muscleMass', 45),
      midAugustWith('muscleMass', 46),
    );

    const widgetValues = calculateWidgetValues('muscleMass', boundaries);

    expect(widgetValues.state).toBe('range');
    const range = widgetValues as Range;
    expect(range.averageMonthlyChange).toBeCloseTo(0.66666, 4);
  });

  test('returns empty widget values when boundaries are not present', () => {
    const widgetValues = calculateWidgetValues('muscleMass', null);

    expect(widgetValues.state).toBe('empty');
  });

  test('returns sinlge day widget values when there is only one body data record', () => {
    const boundaries = toBoundaryRecords(endOfAugustWith('weight', 65));
    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('singleDay');
  });

  test('sinlge day widget values are correct', () => {
    const boundaries = toBoundaryRecords(endOfAugustWith('weight', 65));
    const widgetValues = calculateWidgetValues('weight', boundaries);

    expect(widgetValues.state).toBe('singleDay');
    const singleDay = widgetValues as SingleDay;
    expect(singleDay.value).toBe(65);
    expect(singleDay.recordedAt).toEqual(boundaries?.first.recordedAt);
  });
});
