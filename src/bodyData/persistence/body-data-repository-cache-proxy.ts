import type { BodyDataRepository, QueryOptions } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import type { AzureFunctionsBodyDataRepository } from '@/bodyData/persistence/body-data-repository-az-func';
import { endOfDay, startOfDay } from 'date-fns';

export class BodyDataRepositoryCacheProxy implements BodyDataRepository {
  private cache: BodyData[] = [];
  constructor(private readonly realRepository: AzureFunctionsBodyDataRepository) {}

  private getBoundariesOfCachedData() {
    if (this.cache.length < 2) return null;

    const oldest = this.cache[0].recordedAt;
    const latest = this.cache[this.cache.length - 1].recordedAt;

    return {
      latest,
      oldest,
    };
  }

  private isInCacheRange(start: Date, end: Date) {
    const boundaries = this.getBoundariesOfCachedData();

    if (!boundaries) return false;

    return start >= startOfDay(boundaries.oldest) && end <= endOfDay(boundaries.latest);
  }

  private queryCache(start: Date, end: Date) {
    return this.cache.filter((x) => x.recordedAt >= start && x.recordedAt <= end);
  }

  clearCache() {
    this.cache = [];
  }

  async query(options: QueryOptions) {
    if (this.isInCacheRange(options.start, options.end))
      return this.queryCache(options.start, options.end);

    const result = await this.realRepository.query(options);

    return (this.cache = result);
  }

  async delete(recordedAt: Date): Promise<void> {
    await this.realRepository.delete(recordedAt);
    this.clearCache();
  }
}
