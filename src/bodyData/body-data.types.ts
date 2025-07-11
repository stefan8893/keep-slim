export type BodyData = {
  recordedAt: Date;
  weight: number;
  muscleMass: number;
  bodyFat: number;
  water: number;
  bmi: number;
  dailyCalorieRequirement: number;
};

export type BoundaryRecords = {
  first: BodyData;
  firstN: BodyData[];
  last: BodyData;
  lastN: BodyData[];
};

export type BodyDataChange = {
  start: Date;
  end: Date;
  change: number;
};
