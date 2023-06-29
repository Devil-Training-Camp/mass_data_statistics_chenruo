import { type DataObject, type RegionStats } from '../components/types';

export const calculateStatsByRegion = (
  data: DataObject[]
): Record<string, RegionStats> => {
  const statsByRegion: Record<string, RegionStats> = data.reduce<
    Record<string, RegionStats>
  >((acc, obj) => {
    const region = obj.region;
    if (!acc[region]) {
      acc[region] = {
        count: 0,
        sum: 0,
        min: Number.MAX_SAFE_INTEGER,
        max: Number.MIN_SAFE_INTEGER,
        values: [],
      };
    }
    acc[region].count++;
    acc[region].sum += obj.value;
    acc[region].values.push(obj.value);
    if (obj.value < acc[region].min) {
      acc[region].min = obj.value;
    }
    if (obj.value > acc[region].max) {
      acc[region].max = obj.value;
    }
    return acc;
  }, {});

  // 计算平均值和中位值
  for (const region in statsByRegion) {
    const stats = statsByRegion[region];
    const count = stats.count;
    const sum = stats.sum;
    const values = stats.values;

    // 计算平均值
    const avg = sum / count;
    stats.avg = avg;

    // 计算中位值
    values.sort((a, b) => a - b);
    if (count % 2 === 0) {
      const mid = count / 2;
      stats.median = (values[mid - 1] + values[mid]) / 2;
    } else {
      const mid = Math.floor(count / 2);
      stats.median = values[mid];
    }
  }

  return statsByRegion;
};
