export function average(numbers: number[]) {
  if (!numbers.length) return 0;

  return numbers.reduce((acc, next) => acc + next, 0) / numbers.length;
}
