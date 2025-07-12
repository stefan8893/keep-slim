import { getBoundaryRecords } from '@/bodyData/aggregations/boundaries';
import { describe, expect, test } from 'vitest';

import { getTestData } from './testData/body-data';

describe('getBoundaryRecords', () => {
  test('returns null when there are no body data records', () => {
    const boundaries = getBoundaryRecords([]);

    expect(boundaries).toEqual(null);
  });

  test('all boundary records are equal when there is only one body data record', () => {
    const testData = getTestData();
    const entry = testData.at(0)!;
    const boundaries = getBoundaryRecords([entry]);

    expect(boundaries).toBeTruthy();
    expect(boundaries?.first).toEqual(entry);
    expect(boundaries?.firstN).toHaveLength(1);
    expect(boundaries?.firstN[0]).toEqual(entry);
    expect(boundaries?.last).toEqual(entry);
    expect(boundaries?.firstN).toHaveLength(1);
    expect(boundaries?.lastN[0]).toEqual(entry);
  });

  test('first is the first body data record when there are two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!]);

    expect(boundaries?.first).toEqual(testData.at(0)!);
  });

  test('last is the last body data record when there are two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!]);

    expect(boundaries?.last).toEqual(testData[1]);
  });

  test('firstN contains only the first body data record when there are two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!]);

    expect(boundaries?.firstN).toHaveLength(1);
    expect(boundaries?.firstN[0]).toEqual(testData[0]);
  });

  test('lastN contains only the last body data record when there are two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!]);

    expect(boundaries?.lastN).toHaveLength(1);
    expect(boundaries?.lastN[0]).toEqual(testData[1]);
  });

  test('first is the first body data record when there are more than two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.first).toEqual(testData.at(0)!);
  });

  test('last is the last body data record when there are more than two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.last).toEqual(testData.at(-1));
  });

  test('firstN records are equal to the first n body data records when there are more than two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.firstN).toEqual(testData.slice(0, boundaries?.firstN.length ?? 0));
  });

  test('lastN records are equal to the last n body data records in reverse order when there are more than two in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.lastN).toEqual(testData.slice(-(boundaries?.lastN.length ?? 0)).reverse());
  });

  test('firstN contains four entries when there are ten body data records in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData.slice(0, 10));

    expect(boundaries?.firstN).toHaveLength(4);
  });

  test('firstN contains five entries when there are thirty body data records in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData.slice(0, 31));

    expect(boundaries?.firstN).toHaveLength(5);
  });

  test('lastN contains three entries when there are ten body data records in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData.slice(0, 10));

    expect(boundaries?.lastN).toHaveLength(3);
  });

  test('lastN contains three entries when there are thirty body data records in total', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData.slice(0, 31));

    expect(boundaries?.lastN).toHaveLength(3);
  });

  test('returns the elements based on the array position, because it expects an ordered array', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!, testData.at(0)!]);

    expect(boundaries?.first).toEqual(testData.at(0)!);
    expect(boundaries?.last).toEqual(testData.at(0)!);
  });

  test('the first record is equal to the first entry in the firstN array', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.first).toEqual(boundaries?.firstN.at(0));
  });

  test('the last record is equal to the last entry in the lastN array', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.last).toEqual(boundaries?.lastN.at(0));
  });
});
