import { getBoundaryRecords } from '@/bodyData/aggregations/boundaries';
import { describe, expect, test } from 'vitest';

import { getTestData } from './testData/body-data';

describe('getBoundaryRecords', () => {
  test('returns null when passing an empty array', () => {
    const boundaries = getBoundaryRecords([]);

    expect(boundaries).toEqual(null);
  });

  test('returns boudary object with same records when passing an array with one element', () => {
    const testData = getTestData();
    const entry = testData.at(0)!;
    const boundaries = getBoundaryRecords([entry]);

    expect(boundaries?.first).toEqual(entry);
    expect(boundaries?.firstN[0]).toEqual(entry);
    expect(boundaries?.last).toEqual(entry);
    expect(boundaries?.lastN[0]).toEqual(entry);
  });

  test('returns boundaries without N-elements arrays when passing an array with two elements', () => {
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

  test('the first element is equal to the first element of the firstN array', () => {
    const testData = getTestData();
    const boundaries = getBoundaryRecords(testData);

    expect(boundaries?.first).toEqual(boundaries?.firstN.at(0));
  });
});
