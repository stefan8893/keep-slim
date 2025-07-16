import type {
  BodyDataCsvImportService,
  ClearBodyDataRepositoryCacheFn,
} from '@/bodyData/body-data-persistence.types.ts';
import type { BodyData } from '@/bodyData/body-data.types.ts';
import { toBodyData } from '@/bodyData/persistence/body-data-dto.ts';
import type { Fetch } from '@/types/utils.types';

export class AzureFunctionsBodyDataCsvImportService implements BodyDataCsvImportService {
  private readonly baseUrl;

  constructor(
    baseUrl: string,
    private readonly fetch: Fetch,
    private readonly clearCache: ClearBodyDataRepositoryCacheFn,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getPreview(csvFile: File): Promise<BodyData[]> {
    const url = `${this.baseUrl}/api/csv-import?dryRun=true`;
    const result = await this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': csvFile.type || 'application/octet-stream',
        'X-Filename': csvFile.name,
      },
      body: csvFile,
    }).then((r) => r.json());

    return toBodyData(result);
  }

  async import(csvFile: File): Promise<BodyData[]> {
    const url = `${this.baseUrl}/api/csv-import`;
    const result = await this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': csvFile.type || 'application/octet-stream',
        'X-Filename': csvFile.name,
      },
      body: csvFile,
    }).then((r) => r.json());

    this.clearCache();

    return toBodyData(result);
  }
}
