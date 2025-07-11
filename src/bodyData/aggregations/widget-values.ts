import type { BodyData, BoundaryRecords } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/type-helpers';

export type WidgetValues = {
  latestRecordDateTime: Date;
  latestValue: number;
  changeInSelectedTimeRange: number;
  weeklyAverageChange: number;
  monthlyAverageChange: number;
};

const emptyWidgetValues = {
  latestRecordDateTime: new Date(0),
  latestValue: 0,
  changeInSelectedTimeRange: 0,
  weeklyAverageChange: 0,
  monthlyAverageChange: 0,
};

export function calculateWidgetValues(
  key: NumberKeys<BodyData>,
  boundaryRecords?: BoundaryRecords,
): WidgetValues {
  if (!boundaryRecords) return emptyWidgetValues;

  const change = boundaryRecords.last[key] - boundaryRecords.first[key];

  return {
    latestRecordDateTime: boundaryRecords?.last.recordedAt,
    latestValue: boundaryRecords.last[key],
    changeInSelectedTimeRange: change,
    weeklyAverageChange: 0.4,
    monthlyAverageChange: 0,
  };
}
