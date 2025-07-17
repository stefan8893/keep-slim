import { getTestData } from '@/bodyData/aggregations/__tests__/testData/body-data';
import type { BodyDataRepository, QueryOptions } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import { delay } from '@/utils';
import { compareAsc } from 'date-fns';

export class DevBodyDataRepository implements BodyDataRepository {
  private defaultDelay: number = 1500;
  private bodyData: BodyData[];
  constructor() {
    this.bodyData = getTestData();
  }

  add(bodyData: BodyData[]) {
    this.bodyData.push(...bodyData);
  }

  async query(options: QueryOptions): Promise<BodyData[]> {
    await delay(this.defaultDelay);

    const result = this.bodyData
      .filter((x) => x.recordedAt >= options.start && x.recordedAt <= options.end)
      .sort((a, b) => compareAsc(a.recordedAt, b.recordedAt));

    return Promise.resolve(result);
  }

  async delete(recordedAt: Date): Promise<void> {
    await delay(this.defaultDelay);
    this.bodyData = this.bodyData.filter((x) => compareAsc(x.recordedAt, recordedAt) !== 0);

    return Promise.resolve();
  }
}
