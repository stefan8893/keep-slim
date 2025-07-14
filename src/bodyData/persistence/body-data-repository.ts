import type { BodyData } from '@/bodyData/body-data.types';
import type {
  BodyDataRepository,
  QueryOptions,
} from '@/bodyData/persistence/body-data-repository.types';
import type {} from '@/bodyData/persistence/useBodyDataRepository';
import { type TableClient, type TableEntityResult } from '@azure/data-tables';
import { compareAsc, format } from 'date-fns';

export class AzureTablesBodyDataRepository implements BodyDataRepository {
  constructor(private readonly bodyDataTableClient: TableClient) {}

  private formatToRowKey(date: Date) {
    return format(date, `yyyy-MM-dd'T'HH:mm:ss`);
  }

  private toFilter(options: QueryOptions) {
    const start = this.formatToRowKey(options.start);
    const end = this.formatToRowKey(options.end);

    return `PartitionKey eq 'body_data' and RowKey ge '${start}' and RowKey le '${end}'`;
  }

  private toBodyData(entity: TableEntityResult<Record<string, unknown>>): BodyData {
    return {
      recordedAt: new Date(entity.rowKey!),
      weight: entity['Weight'] as number,
      muscleMass: entity['MuscleMass'] as number,
      bodyFat: entity['BodyFat'] as number,
      water: entity['BodyWater'] as number,
      bmi: entity['Bmi'] as number,
      dailyCalorieRequirement: entity['DailyCalorieRequirement'] as number,
    };
  }

  async query(options: QueryOptions) {
    const filter = this.toFilter(options);
    const iterator = this.bodyDataTableClient.listEntities({ queryOptions: { filter } });

    const result = (await Array.fromAsync(iterator)).map(this.toBodyData);
    return result.sort((a, b) => compareAsc(a.recordedAt, b.recordedAt));
  }

  async delete(recordedAt: Date): Promise<void> {
    await this.bodyDataTableClient.deleteEntity('body_data', this.formatToRowKey(recordedAt));
  }
}
