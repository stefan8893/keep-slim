import type { BodyData } from '@/bodyData/body-data.types';

import testDataJson from './body-data.json';

export function getTestData(): BodyData[] {
  return (testDataJson as unknown as Record<string, Date | number>[]).map(
    (x) =>
      ({
        ...x,
        recordedAt: new Date(x.recordedAt),
      }) as BodyData,
  );
}
