import type { BodyDataRepository, QueryOptions } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import { toBodyData } from '@/bodyData/persistence/body-data-dto';
import type { Fetch } from '@/types/utils.types';
import { format } from 'date-fns';

export class AzureFunctionsBodyDataRepository implements BodyDataRepository {
  private readonly baseUrl;

  constructor(
    baseUrl: string,
    private readonly fetch: Fetch,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private formatToQueryDate(date: Date) {
    return format(date, `yyyy-MM-dd`);
  }

  private formatToRowKey(date: Date) {
    return format(date, `yyyy-MM-dd'T'HH:mm:ss`);
  }

  private toQueryString(params: Record<string, string>) {
    return new URLSearchParams(params).toString();
  }

  async query(options: QueryOptions): Promise<BodyData[]> {
    const url = `${this.baseUrl}/api/body-data?${this.toQueryString({
      startDate: this.formatToQueryDate(options.start),
      endDate: this.formatToQueryDate(options.end),
    })}`;

    const response = await this.fetch(url).then((r) => r.json());

    return toBodyData(response);
  }

  async delete(recordedAt: Date): Promise<void> {
    const url = `${this.baseUrl}/api/body-data?${this.toQueryString({
      recordedAt: this.formatToRowKey(recordedAt),
    })}`;

    await this.fetch(url, {
      method: 'DELETE',
    });
  }
}
