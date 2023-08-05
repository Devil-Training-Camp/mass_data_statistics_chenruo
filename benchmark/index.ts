/**
 * run pnpm test
 */

// Benchmark 相关的代码应该放在 benchmark 目录，不需要放在 src
import { benchmarkSuite } from '../src/utils/benchmark.js';
import { calculateValuesByParams } from '../src/utils/calculateValuesByParams.js';
import { calculateWeightStats } from '../src/utils/calculateWeightStats.js';

const mockData = [
  {
    id: '44',
    sim_name: 'BHS',
    name: 'Bahamas',
    region: 'Caribbean and Central America',
    resource: 'Cereals',
    year: 2012,
    value: 427.395,
    weight: 969.33,
  },
  {
    id: '44',
    sim_name: 'BHS',
    name: 'Bahamas',
    region: 'Caribbean and Central America',
    resource: 'Cereals',
    year: 2012,
    value: 427.395,
    weight: 969.33,
  },
];

benchmarkSuite([
  {
    calculateValuesByParamsFuncTest: function () {
      calculateValuesByParams(mockData, ['region']);
    },
  },
  {
    calculateWeightStatsFuncTest: function () {
      calculateWeightStats(mockData, 'weight');
    },
  },
]).run({ async: true });
