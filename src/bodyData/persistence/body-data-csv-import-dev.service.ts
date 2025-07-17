import type { BodyDataCsvImportService } from '@/bodyData/body-data-persistence.types.ts';
import type { BodyData } from '@/bodyData/body-data.types.ts';
import type { DevBodyDataRepository } from '@/bodyData/persistence/body-data-dev.repository.ts';
import { delay } from '@/utils';
import { compareAsc, parse } from 'date-fns';
// @ts-expect-error technical difficulties to load the typings included in 'papaparse'
import * as Papa from 'papaparse';

export class DevBodyDataCsvImportService implements BodyDataCsvImportService {
  private defaultDelay: number = 1500;
  constructor(private readonly bodyDataRepository: DevBodyDataRepository) {}

  private parse(csvFile: File): Promise<BodyData[]> {
    return new Promise<BodyData[]>((resolve) => {
      Papa.parse(csvFile, {
        complete: function (results: { data: Record<string, string>[] }) {
          const bodyData: BodyData[] = results.data
            .filter((x) => Object.keys(x).length === 9)
            .map((x) => {
              return {
                recordedAt: parse(`${x.Datum} ${x.Zeit}`, 'dd.MM.yyyy HH:mm', new Date()),
                weight: Number(x.Gewicht),
                muscleMass: Number(x.Muskel),
                bodyFat: Number(x.Fett),
                water: Number(x.Wasser),
                bmi: Number(x.BMI),
                dailyCalorieRequirement: Number(x.Kalorienverbrauch),
              };
            });

          resolve(bodyData);
        },
        header: true,
        skipFirstNLines: 2,
      });
    });
  }

  async getPreview(csvFile: File): Promise<BodyData[]> {
    await delay(this.defaultDelay);
    const parsed = (await this.parse(csvFile)).sort((a, b) =>
      compareAsc(a.recordedAt, b.recordedAt),
    );

    if (parsed.length === 0) return [];

    const first = parsed[0];
    const last = parsed.at(-1)!;

    const existing = (
      await this.bodyDataRepository.query({
        start: first.recordedAt,
        end: last.recordedAt,
      })
    ).map((x) => x.recordedAt);

    return parsed.filter((x) => !existing.some((y) => compareAsc(y, x.recordedAt) === 0));
  }

  async import(csvFile: File): Promise<BodyData[]> {
    await delay(this.defaultDelay);
    const newEntries = await this.getPreview(csvFile);

    this.bodyDataRepository.add(newEntries);
    return newEntries;
  }
}
