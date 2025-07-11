import { getBoundaryRecords } from '@/bodyData/aggregations/boundaries';
import { describe, expect, test } from 'vitest';

import { getTestData } from './testData/body-data';

describe('getBoundaryRecords', () => {
  test('returns null when passing an empty array', () => {
    const boundaries = getBoundaryRecords([]);

    expect(boundaries).toEqual(null);
  });

  test('returns null when passing an array with one element', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!]);

    expect(boundaries).toEqual(null);
  });

  test('returns a correct boundaries when passing an array with two elements', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!]);

    expect(boundaries?.first).toEqual(testData.at(0)!);
    expect(boundaries?.last).toEqual(testData.at(1)!);
  });

  test('returns firstN array with one element that is equal to first', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!]);

    expect(boundaries?.firstN).toHaveLength(1);
    expect(boundaries?.firstN.at(0)).toEqual(boundaries?.first);
  });

  test('returns the elements based on the array position, because it expects an ordered array', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords([testData.at(0)!, testData.at(1)!, testData.at(0)!]);

    expect(boundaries?.first).toEqual(testData.at(0)!);
    expect(boundaries?.last).toEqual(testData.at(0)!);
  });

  test('returns the last and first entry of a larger set of data', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.first).toEqual(testData.at(0)!);
    expect(boundaries?.last).toEqual(testData.at(-1)!);
  });

  test('returns the first three elements along with the first and last', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.first).toBeTruthy();
    expect(boundaries?.last).toBeTruthy();

    expect(boundaries?.firstN).toHaveLength(3);
    expect(boundaries?.firstN.at(0)).toEqual(testData.at(0));
    expect(boundaries?.firstN.at(1)).toEqual(testData.at(1));
    expect(boundaries?.firstN.at(2)).toEqual(testData.at(2));
  });

  test('firstN is limited to three by default', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.firstN).toHaveLength(3);
  });

  test('returns as much firstN records as specified', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData, 8);

    expect(boundaries?.firstN).toHaveLength(8);
  });

  test('returns all input records except the last one when requesting more firstN records than exist', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData, 9999);

    expect(boundaries?.firstN).toHaveLength(testData.length - 1);
  });
});
