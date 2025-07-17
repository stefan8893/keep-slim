import { average } from '@/bodyData/aggregations/math-utils';
import type {
  BodyData,
  BodyDataSummarizedByDay,
  BodyDataSummarizedByWeek,
  Summarized,
  SummarizedBodyData,
} from '@/bodyData/body-data.types';
import { formatISO, parseISO, startOfDay, startOfISOWeek } from 'date-fns';

function averageDate(dates: Date[]): Date {
  if (dates.length < 1) return new Date(0);

  return new Date(average(dates.map((x) => x.getTime())));
}

function summarizeValues(
  group: BodyData[],
): Summarized<BodyData, 'weight' | 'muscleMass' | 'bodyFat' | 'water'> {
  return {
    weight: {
      value: average(group.map((x) => x.weight)),
      count: group.length,
    },
    muscleMass: {
      value: average(group.map((x) => x.muscleMass)),
      count: group.length,
    },
    bodyFat: {
      value: average(group.map((x) => x.bodyFat)),
      count: group.length,
    },
    water: {
      value: average(group.map((x) => x.water)),
      count: group.length,
    },
  };
}

function summarizeByDay(grouped: Map<string, BodyData[]>): BodyDataSummarizedByDay {
  return {
    type: 'summarizedByDay',
    result: Array.from(grouped).map(([, group]) => ({
      day: group.length === 1 ? group[0].recordedAt : averageDate(group.map((x) => x.recordedAt)),
      values: summarizeValues(group),
    })),
  };
}

function summarizeByWeek(grouped: Map<string, BodyData[]>): BodyDataSummarizedByWeek {
  return {
    type: 'summarizedByWeek',
    result: Array.from(grouped).map(([firstDayOfWeek, group]) => ({
      firstDayOfWeek: parseISO(firstDayOfWeek),
      values: summarizeValues(group),
    })),
  };
}

const summarizeByDayThresholdInDays = 45;
export function prepareBodyDataForChart(bodyData: BodyData[]): SummarizedBodyData {
  if (bodyData.length < 1)
    return {
      type: 'summarizedByDay',
      result: [],
    };

  const groupedByDay = Map.groupBy(bodyData, (x) => formatISO(startOfDay(x.recordedAt)));
  const groupByWeek = () => {
    return Map.groupBy(bodyData, (x) => formatISO(startOfISOWeek(x.recordedAt)));
  };

  if (groupedByDay.size > summarizeByDayThresholdInDays) return summarizeByWeek(groupByWeek());
  else return summarizeByDay(groupedByDay);
}
