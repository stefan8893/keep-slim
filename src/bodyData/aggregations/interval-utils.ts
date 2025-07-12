import type { IntervalUtils, Period } from '@/bodyData/aggregations/change-over-time';
import {
  addMonths,
  addWeeks,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  endOfISOWeek,
  endOfMonth,
  format,
  getISOWeek,
  startOfISOWeek,
  startOfMonth,
} from 'date-fns';

export class MonthlyExactIntervalUtils implements IntervalUtils {
  createPeriod(identifier: string, range: Date[]): Period {
    return {
      type: 'monthlyExact',
      month: identifier,
      range: {
        start: range[0],
        end: range[1],
      },
    };
  }
  getStartOfNextInterval(date: Date): Date {
    return startOfMonth(addMonths(date, 1));
  }
  differenceInInterval(start: Date, end: Date): number {
    return differenceInCalendarMonths(start, end);
  }
  endOfInterval(date: Date): Date {
    return endOfMonth(date);
  }
  addInterval(date: Date, count: number): Date {
    return addMonths(date, count);
  }
  getIntervalIdentifier(date: Date): string {
    return format(date, 'yyyy-MM');
  }
}

export class WeeklyExactIntervalUtils implements IntervalUtils {
  createPeriod(identifier: string, range: Date[]): Period {
    return {
      type: 'weeklyExact',
      isoWeek: identifier,
      range: {
        start: range[0],
        end: range[1],
      },
    };
  }
  getStartOfNextInterval(date: Date): Date {
    return startOfISOWeek(addWeeks(date, 1));
  }
  differenceInInterval(start: Date, end: Date): number {
    return differenceInCalendarISOWeeks(start, end);
  }
  endOfInterval(date: Date): Date {
    return endOfISOWeek(date);
  }
  addInterval(date: Date, count: number): Date {
    return addWeeks(date, count);
  }
  getIntervalIdentifier(date: Date): string {
    return getISOWeek(date).toString();
  }
}
