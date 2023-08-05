interface DataObject {
  id: string;
  sim_name: string;
  name: string;
  region: string;
  resource: string;
  year: number;
  value: number;
  weight: number;
}

// 也可以考虑直接用 lodash 的 groupBy
// 如果我去写的话，这个 keys 应该是一个函数；
const groupBy = <T extends keyof DataObject>(data: DataObject[], keys: T[]): Record<string, DataObject[]> => {
  return data.reduce((groups: any, obj: DataObject) => {
    const groupKey = keys.map((key) => obj[key]).join('-');
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(obj);
    return groups;
  }, {});
};

const calculateAverage = (arr: number[]): number => {
  const sum = arr.reduce((total: number, value: number) => total + value, 0);
  return sum / arr.length;
};

const calculateMedian = (arr: number[]): number => {
  const sortedArr = arr.sort((a: number, b: number) => a - b);
  const middleIndex = Math.floor(sortedArr.length / 2);

  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middleIndex - 1] + sortedArr[middleIndex]) / 2;
  } else {
    return sortedArr[middleIndex];
  }
};

export const calculateValuesByParams = <T extends keyof DataObject>(data: DataObject[], groupByKeys: T[]): any => {
  const groups = groupBy(data, groupByKeys);
  const result: any = {};

  for (const key in groups) {
    const group = groups[key];

    // Calculate statistics for the group
    const statistics = {
      average: calculateAverage(group.map((obj: DataObject) => obj.value)),
      maximum: Math.max(...group.map((obj: DataObject) => obj.value)),
      minimum: Math.min(...group.map((obj: DataObject) => obj.value)),
      median: calculateMedian(group.map((obj: DataObject) => obj.value)),
      // calculateAverage 函数里面其实就可以复用这段逻辑；
      // 例如，抽象出一个 sum 函数
      sum: group.reduce((sum: number, obj: DataObject) => sum + obj.value, 0),
    };

    result[key] = statistics;
  }

  return result;
};
