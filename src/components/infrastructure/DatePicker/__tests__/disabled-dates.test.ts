import {
  isEndDateDisabled,
  isStartDateDisabled,
} from '@/components/infrastructure/DatePicker/disabled-dates';
import { parseISO } from 'date-fns';
import { describe, expect, test } from 'vitest';

const minDate = parseISO('2025-07-01');
const maxDate = parseISO('2025-07-31');

describe('DateRangePicker disabled start date', () => {
  test('date is not disabled when it is between min and max date', () => {
    const result = isStartDateDisabled(parseISO('2025-07-07'), minDate, maxDate);
    expect(result).toBe(false);
  });

  test('date is disabled when it is before min date', () => {
    const result = isStartDateDisabled(parseISO('2025-06-30'), minDate, maxDate);
    expect(result).toBe(true);
  });

  test('date is not disabled when it is equal to min date', () => {
    const result = isStartDateDisabled(parseISO('2025-07-01'), minDate, maxDate);
    expect(result).toBe(false);
  });

  test('date is disabled when it is after max date', () => {
    const result = isStartDateDisabled(parseISO('2025-08-01'), minDate, maxDate);
    expect(result).toBe(true);
  });

  test('date is not disabled when it is equal to max date', () => {
    const result = isStartDateDisabled(parseISO('2025-07-31'), minDate, maxDate);
    expect(result).toBe(false);
  });

  test('date is disabled when it is after end date', () => {
    const endDate = parseISO('2025-07-15');
    const result = isStartDateDisabled(parseISO('2025-07-16'), minDate, maxDate, endDate);
    expect(result).toBe(true);
  });

  test('date is not disabled when it is equal to end date', () => {
    const endDate = parseISO('2025-07-15');
    const result = isStartDateDisabled(parseISO('2025-07-15'), minDate, maxDate, endDate);
    expect(result).toBe(false);
  });
});

describe('DateRangePicker disabled end date', () => {
  test('date is not disabled when it is between min and max date', () => {
    const result = isEndDateDisabled(parseISO('2025-07-07'), minDate, maxDate);
    expect(result).toBe(false);
  });

  test('date is disabled when it is before min date', () => {
    const result = isEndDateDisabled(parseISO('2025-06-30'), minDate, maxDate);
    expect(result).toBe(true);
  });

  test('date is not disabled when it is equal to min date', () => {
    const result = isEndDateDisabled(parseISO('2025-07-01'), minDate, maxDate);
    expect(result).toBe(false);
  });

  test('date is disabled when it is after max date', () => {
    const result = isEndDateDisabled(parseISO('2025-08-01'), minDate, maxDate);
    expect(result).toBe(true);
  });

  test('date is not disabled when it is equal to max date', () => {
    const result = isEndDateDisabled(parseISO('2025-07-31'), minDate, maxDate);
    expect(result).toBe(false);
  });

  test('date is disabled when it is before start date', () => {
    const startDate = parseISO('2025-07-15');
    const result = isEndDateDisabled(parseISO('2025-07-14'), minDate, maxDate, startDate);
    expect(result).toBe(true);
  });

  test('date is not disabled when it is equal to start date', () => {
    const startDate = parseISO('2025-07-15');
    const result = isEndDateDisabled(parseISO('2025-07-15'), minDate, maxDate, startDate);
    expect(result).toBe(false);
  });
});
