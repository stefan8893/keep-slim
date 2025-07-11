import type { BodyData, BoundaryRecords } from '@/bodyData/body-data.types';

export function getBoundaryRecords(
  bodyData: BodyData[],
  firstNRecords?: number,
): BoundaryRecords | null {
  if (bodyData.length <= 1) return null;

  const takeFirstNRecords = Math.min(firstNRecords ?? 3, bodyData.length - 1);

  return {
    first: bodyData.at(0)!,
    firstN: bodyData.slice(0, takeFirstNRecords),
    last: bodyData.at(-1)!,
  };
}
