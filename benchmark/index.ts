/***
 * run pnpm test
 */

import Benchmark from 'benchmark';
import { calculateValuesByParams } from '../src/utils/calculateValuesByParams.js';
import { calculateWeightStats } from '../src/utils/calculateWeightStats.js';

let suite = new Benchmark.Suite();
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

/**
 * `event.target` returns the complete Benchmark object itself, while in its
 * stringified form, we get a nice outputtable summary of the benchmark's
 * perf data (appx ops/sec, # runs sampled).
 */

suite
  .add('calculateValuesByParamsFuncTest', function () {
    calculateValuesByParams(mockData, ['region']);
  })
  .add('calculateWeightStatsFuncTest', function () {
    calculateWeightStats(mockData, 'weight');
  })
  // add listeners
  .on('cycle', function (event: { target: object }) {
    const benchmark = event.target;
    console.log('benchmark-event', benchmark.toString());
  })
  .on('complete', function (event: any) {
    const suite = event.currentTarget;
    console.log('event.target in complete', suite);
  })
  .run({ async: true });
