import type { BodyData } from '@/bodyData/body-data.types';
import type { NumberKeys } from '@/types/type-helpers';
import { compareAsc } from 'date-fns';

export type InterpolatedValue = {
  recordedAt: Date;
  value: number;
};

type SearchMode = 'previous-if-no-exact-match' | 'next-if-no-exact-match';

export class BodyDataInterpolation {
  private data: BodyData[];

  constructor(data: BodyData[]) {
    this.data = data.sort((a, b) => compareAsc(a.recordedAt, b.recordedAt));
  }

  // based on https://en.wikipedia.org/wiki/Binary_search
  private search(mode: SearchMode, target: Date, low = 0, high = this.data.length - 1): BodyData {
    if (target < this.data[low].recordedAt) {
      return this.data[low];
    }

    if (target > this.data[high].recordedAt) {
      return this.data[high];
    }

    if (high - low < 2) {
      return mode === 'previous-if-no-exact-match' ? this.data[low] : this.data[high];
    }

    const middle = Math.floor((high + low) / 2);

    if (target < this.data[middle].recordedAt) {
      return this.search(mode, target, low, middle);
    }

    if (target > this.data[middle].recordedAt) {
      return this.search(mode, target, middle, high);
    }

    return this.data[middle];
  }

  private findSurroundingEntries(x: Date): {
    previous: BodyData | undefined;
    next: BodyData | undefined;
  } {
    return {
      previous: this.search('previous-if-no-exact-match', x),
      next: this.search('next-if-no-exact-match', x),
    };
  }

  private interpolate(
    key: NumberKeys<BodyData>,
    recordedAt: Date,
    previous: BodyData,
    next: BodyData,
  ) {
    const x0 = previous.recordedAt.getTime();
    const y0 = previous[key];
    const x1 = next.recordedAt.getTime();
    const y1 = next[key];

    // https://en.wikipedia.org/wiki/Linear_function_(calculus)
    const slope = Math.abs((y1 - y0) / (x1 - x0));
    const a = isNaN(slope) ? 0 : slope;
    const x = recordedAt.getTime() - x0;
    const b = y1 > y0 ? y0 : -y0;

    return Math.abs(a * x + b);
  }

  at(recordedAt: Date, key: NumberKeys<BodyData>): InterpolatedValue | null {
    const { previous, next } = this.findSurroundingEntries(recordedAt);

    if (!previous || !next) return null;

    if (compareAsc(previous.recordedAt, recordedAt) === 0) {
      return { recordedAt: previous.recordedAt, value: previous[key] };
    }

    if (compareAsc(next.recordedAt, recordedAt) === 0) {
      return { recordedAt: previous.recordedAt, value: next[key] };
    }

    const interpolated = this.interpolate(key, recordedAt, previous, next);

    return {
      recordedAt: recordedAt,
      value: interpolated,
    };
  }
}
