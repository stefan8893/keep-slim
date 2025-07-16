import type { NumberKeys } from '@/types/helpers.types';

export type IntervalChangeOverTime = 'weeklyExact' | 'monthlyExact';

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

export type TimeRange = {
  start: Date;
  end: Date;
};

export type BodyDataChange = {
  interval: IntervalChangeOverTime;
  property: NumberKeys<BodyData>;
  value: number;
} & TimeRange;

export type MonthlyPeriod = {
  type: 'weeklyExact';
  isoWeek: string;
  range: TimeRange;
};

export type WeeklyPeriod = {
  type: 'monthlyExact';
  month: string;
  range: TimeRange;
};

export type Period = WeeklyPeriod | MonthlyPeriod;

export type Summarized<T, K extends keyof T> = {
  [P in K]: {
    value: T[P];
    count: number;
  };
};

export type SummarizedBodyDataProperty = 'weight' | 'muscleMass' | 'bodyFat' | 'water';

export type SingleBodyDataSummarizedByDay = {
  day: Date;
  values: Summarized<BodyData, SummarizedBodyDataProperty>;
};

export type SingleBodyDataSummarizedByWeek = {
  firstDayOfWeek: Date;
  values: Summarized<BodyData, SummarizedBodyDataProperty>;
};

export type BodyDataSummarizedByDay = {
  type: 'summarizedByDay';
  result: SingleBodyDataSummarizedByDay[];
};

export type BodyDataSummarizedByWeek = {
  type: 'summarizedByWeek';
  result: SingleBodyDataSummarizedByWeek[];
};

export type SummarizedBodyData = BodyDataSummarizedByDay | BodyDataSummarizedByWeek;
