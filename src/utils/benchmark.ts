/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Benchmark from 'benchmark';
import ora from 'ora';
import chalk from 'chalk';
import { Table } from 'console-table-printer';

const suite = new Benchmark.Suite();
const { description } = Benchmark.platform;
const spinner = ora();
const p = new Table({
  columns: [
    { name: 'case', title: '测试用例' },
    { name: 'hz', title: '执行次数/秒' },
    { name: 'rme', title: '相对误差' },
    { name: 'sampled', title: '总执行次数' },
    { name: 'conclusion', title: '结论' },
  ],
  sort: (r1, r2) => Number(r1.hzs) - Number(r2.hzs),
  disabledColumns: ['hzs'],
});

interface ResultObject {
  case: string;
  hz: string;
  hzs: number;
  rme: string;
  sampled: string;
}

const getRows = (events: any): ResultObject[] => {
  const keys = Object.keys(events);
  return keys.reduce((result: ResultObject[], key) => {
    if (/^\d{0,}$/g.test(key)) {
      const {
        name,
        hz,
        stats: { sample, rme },
      } = events[key];
      const size = sample.length;
      result.push({
        case: name,
        hz: Benchmark.formatNumber(hz.toFixed(hz < 100 ? 2 : 0)),
        hzs: hz,
        rme: `\xb1${rme.toFixed(2)}%`,
        sampled: `${size} run${size === 1 ? '' : 's'} sampled`,
      });
    }
    return result;
  }, []);
};

const addRow = (row: any, isFastest: boolean): void => {
  p.addRow(
    {
      ...row,
      conclusion: isFastest ? '🏆 Fastest' : '💔 Slowest',
    },
    { color: isFastest ? 'yellow' : 'cyan' }
  );
};

console.log(chalk.green(description));
spinner.start(chalk.grey('Testing ...'));

export const benchmarkSuite = function (cases: object): Benchmark.Suite {
  if (!cases) {
    throw new Error('Please add test cases correctly.');
  }

  if (!(cases instanceof Array)) {
    throw new Error('Please add a set of test cases correctly.');
  }

  // 添加case

  cases.forEach((c) => {
    const key = Object.keys(c)[0];
    suite.add(key, c[key]);
  });

  // 设置监听

  /**
   * `event.target` returns the complete Benchmark object itself, while in its
   * stringified form, we get a nice outputtable summary of the benchmark's
   * perf data (appx ops/sec, # runs sampled).
   */

  suite
    .on('cycle', function (event: { target: object }) {
      spinner.succeed(chalk.green(String(event.target)));
      spinner.start(chalk.grey('Testing next case ...'));
    })
    .on('complete', function () {
      spinner.succeed(chalk.green('Test completed'));
      getRows(suite.filter('successful')).forEach((row: any) => {
        addRow(row, row.case === suite.filter('fastest').map('name')[0]);
      });
      p.printTable();
    });

  return suite;
};
