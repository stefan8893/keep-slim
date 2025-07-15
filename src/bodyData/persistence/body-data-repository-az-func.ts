import type { AcquireAccessTokenFn } from '@/auth/auth.types';
import type { BodyData } from '@/bodyData/body-data.types';
import type {
  BodyDataRepository,
  QueryOptions,
} from '@/bodyData/persistence/body-data-repository.types';
import type {} from '@/bodyData/persistence/useBodyDataRepository';
import { format } from 'date-fns';

type RawBodyData = Omit<BodyData, 'recordedAt'> & { recordedAt: string };

export class AzureFunctionsBodyDataRepository implements BodyDataRepository {
  private readonly baseUrl;

  constructor(
    baseUrl: string,
    private readonly acquireToken: AcquireAccessTokenFn,
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

  private parseBodyDataResponse(raw: RawBodyData[]): BodyData[] {
    return raw.map((entry) => ({
      recordedAt: new Date(entry.recordedAt),
      weight: Number(entry.weight),
      muscleMass: Number(entry.muscleMass),
      bodyFat: Number(entry.bodyFat),
      water: Number(entry.water),
      bmi: Number(entry.bmi),
      dailyCalorieRequirement: Number(entry.dailyCalorieRequirement),
    }));
  }

  private async fetch(url: string, options?: RequestInit) {
    const accessToken = await this.acquireToken();

    const init: RequestInit = {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    return await fetch(url, init);
  }

  async query(options: QueryOptions): Promise<BodyData[]> {
    const url = `${this.baseUrl}/body-data?${this.toQueryString({
      startDate: this.formatToQueryDate(options.start),
      endDate: this.formatToQueryDate(options.end),
    })}`;

    const response = await this.fetch(url).then((r) => r.json());

    return this.parseBodyDataResponse(response);
  }

  async delete(recordedAt: Date): Promise<void> {
    const url = `${this.baseUrl}/body-data?${this.toQueryString({
      recordedAt: this.formatToRowKey(recordedAt),
    })}`;

    await this.fetch(url, {
      method: 'DELETE',
    });
  }
}
