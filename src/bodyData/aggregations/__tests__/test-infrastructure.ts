import { getBoundaryRecords } from '@/bodyData/aggregations/boundaries';
import type { BodyData } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/helpers.types';
import { endOfMonth, parseISO } from 'date-fns';

const bodyDataTemplate: BodyData = {
  recordedAt: parseISO('2025-01-01'),
  weight: 65,
  muscleMass: 45,
  bodyFat: 13,
  water: 50,
  bmi: 21,
  dailyCalorieRequirement: 2100,
};

export function startOfJulyWith(property: NumberKeys<BodyData>, value: number): BodyData {
  return {
    ...bodyDataTemplate,
    recordedAt: parseISO('2025-07-01'),
    [property]: value,
  };
}

export function endOfJulyWith(property: NumberKeys<BodyData>, value: number): BodyData {
  return {
    ...bodyDataTemplate,
    recordedAt: endOfMonth(parseISO('2025-07-01')),
    [property]: value,
  };
}

export function midAugustWith(property: NumberKeys<BodyData>, value: number): BodyData {
  return {
    ...bodyDataTemplate,
    recordedAt: parseISO('2025-08-16T12:00:00'),
    [property]: value,
  };
}

export function endOfAugustWith(property: NumberKeys<BodyData>, value: number): BodyData {
  return {
    ...bodyDataTemplate,
    recordedAt: endOfMonth(parseISO('2025-08-01')),
    [property]: value,
  };
}

export function createBodyDataRecordWith(record: Partial<BodyData>) {
  return {
    ...bodyDataTemplate,
    ...record,
  };
}

export function createBodyDataRecord(
  recordedAt: Date,
  property: NumberKeys<BodyData>,
  value: number,
) {
  return {
    ...bodyDataTemplate,
    recordedAt: recordedAt,
    [property]: value,
  };
}

export function toBoundaryRecords(head: BodyData, ...tail: BodyData[]) {
  return getBoundaryRecords([head, ...tail]);
}
