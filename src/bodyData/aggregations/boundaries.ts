import type { BodyData, BoundaryRecords } from '@/bodyData/body-data.types';

function determineRecordsToTake(size: number) {
  if (size <= 2) return [1, 1];
  else if (size <= 4) return [2, 1];
  else if (size <= 7) return [3, 2];
  else if (size <= 28) return [4, 3];
  else if (size <= 90) return [5, 3];
  else if (size <= 180) return [6, 3];
  else return [7, 4];
}

export function getBoundaryRecords(bodyData: BodyData[]): BoundaryRecords | null {
  if (bodyData.length < 1) return null;

  const [takeFirstN, takeLastN] = determineRecordsToTake(bodyData.length);

  return {
    first: bodyData.at(0)!,
    firstN: bodyData.slice(0, takeFirstN),
    last: bodyData.at(-1)!,
    lastN: bodyData.slice(-takeLastN).reverse(),
  };
}
