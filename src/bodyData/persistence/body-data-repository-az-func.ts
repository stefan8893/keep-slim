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

  private toQueryString(options: QueryOptions) {
    return new URLSearchParams({
      startDate: this.formatToQueryDate(options.start),
      endDate: this.formatToQueryDate(options.end),
    }).toString();
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

  private async fetch(url: string) {
    const accessToken = await this.acquireToken();

    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async query(options: QueryOptions): Promise<BodyData[]> {
    const url = `${this.baseUrl}/body-data?${this.toQueryString(options)}`;

    const response = await this.fetch(url).then((r) => r.json());

    return this.parseBodyDataResponse(response);
  }

  async delete(recordedAt: Date): Promise<void> {
    console.log('not yet implemented', recordedAt);
  }
}
