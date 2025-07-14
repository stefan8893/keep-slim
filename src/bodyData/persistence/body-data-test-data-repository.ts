import { getTestData } from '@/bodyData/aggregations/__tests__/testData/body-data';
import type { BodyData } from '@/bodyData/body-data.types';
import type {
  BodyDataRepository,
  QueryOptions,
} from '@/bodyData/persistence/body-data-repository.types';
import { compareAsc } from 'date-fns';

export class BodyDataTestDataRepository implements BodyDataRepository {
  private bodyData: BodyData[];
  constructor() {
    this.bodyData = getTestData();
  }

  query(options: QueryOptions): Promise<BodyData[]> {
    const result = this.bodyData
      .filter((x) => x.recordedAt >= options.start && x.recordedAt <= options.end)
      .sort((a, b) => compareAsc(a.recordedAt, b.recordedAt));

    return Promise.resolve(result);
  }
  delete(recordedAt: Date): Promise<void> {
    this.bodyData = this.bodyData.filter((x) => compareAsc(x.recordedAt, recordedAt) !== 0);

    return Promise.resolve();
  }
}
