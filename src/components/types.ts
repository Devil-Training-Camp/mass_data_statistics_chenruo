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
   * region总数
   */
  count: number;
  /**
   * 总和
   */
  sum: number;
  /**
   * 最小值
   */
  min: number;
  /**
   * 最大值
   */
  max: number;
  /**
   * 每个region下的value集合
   */
  values: number[];
  /**
   * 平均值
   */
  avg?: number;
  /**
   * 中位值
   */
  median?: number;
}
