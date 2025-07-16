import type { BodyData } from '@/bodyData/body-data.types';

export type CsvImport = {
  csvFile: File | null;
  newRecords: BodyData[];
};
