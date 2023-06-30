export interface DataObject {
  id: string;
  sim_name: string;
  name: string;
  region: string;
  resource: string;
  year: number;
  value: number;
  weight: number;
}

export interface RegionStats {
  /**
   * 总和
   */
  sum: number;
  /**
   * 最小值
   */
  minimum: number;
  /**
   * 最大值
   */
  maximum: number;
  /**
   * 平均值
   */
  average: number;
  /**
   * 中位值
   */
  median: number;
}
