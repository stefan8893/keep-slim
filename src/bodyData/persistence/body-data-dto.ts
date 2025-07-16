import type { BodyData } from '@/bodyData/body-data.types';

export type BodyDataDto = Omit<BodyData, 'recordedAt'> & { recordedAt: string };

export function toBodyData(dtos: BodyDataDto[]) {
  return dtos.map((entry) => ({
    recordedAt: new Date(entry.recordedAt),
    weight: Number(entry.weight),
    muscleMass: Number(entry.muscleMass),
    bodyFat: Number(entry.bodyFat),
    water: Number(entry.water),
    bmi: Number(entry.bmi),
    dailyCalorieRequirement: Number(entry.dailyCalorieRequirement),
  }));
}
