interface Data {
  id: string;
  sim_name: string;
  name: string;
  region: string;
  resource: string;
  year: number;
  value: number;
  weight: number;
}

export function calculateWeightStats(
  data: Data[],
  weight: keyof Data
): {
  max: number;
  min: number;
  median: number;
} {
  const weights = data.map((obj) => obj[weight]) as number[];
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const sorted = weights.sort();
  const len = sorted.length;
  const median = len % 2 === 0 ? (sorted[len / 2 - 1] + sorted[len / 2]) / 2 : sorted[(len - 1) / 2];
  return { max, min, median };
}
