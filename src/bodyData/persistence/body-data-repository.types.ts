import type { BodyData } from '@/bodyData/body-data.types';

export type QueryOptions = {
  start: Date;
  end: Date;
};

export interface BodyDataRepository {
  query(options: QueryOptions): Promise<BodyData[]>;
  delete(recordedAt: Date): Promise<void>;
}
