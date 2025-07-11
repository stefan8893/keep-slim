import type { BodyData } from '@/bodyData/body-data.types';
import { type TableClient, type TableEntityResult } from '@azure/data-tables';
import { format } from 'date-fns';

export type QueryOptions = {
  start: Date;
  end: Date;
};

export class BodyDataRepository {
  constructor(private readonly bodyDataTableClient: TableClient) {}

  private toFilter(options: QueryOptions) {
    const start = format(options.start, `yyyy-MM-dd'T'HH:mm:ss`);
    const end = format(options.end, `yyyy-MM-dd'T'HH:mm:ss`);

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
    console.log(options);
    const filter = this.toFilter(options);
    const iterator = this.bodyDataTableClient.listEntities({ queryOptions: { filter } });

    return (await Array.fromAsync(iterator)).map(this.toBodyData);
  }
}
