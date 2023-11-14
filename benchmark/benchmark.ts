// benchmark 抽出去吧，别跟 source file 混在一起了
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Benchmark, { Suite, Target } from 'benchmark';
import ora from 'ora';
import chalk from 'chalk';
// awesome
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

// 上下文来看，这里应该叫做 RowDef?
interface RowDef {
  case: string | undefined;
  hz: string | number | undefined;
  hzs: number | undefined;
  rme: string;
  sampled: string | undefined;
}

const generateRows = (suite: { [key: string]: Target }): RowDef[] => {
  // 如果我来写的话，大概会是：
  // return Object.keys(events).filter(k=>/^\d{0,}$/g.test(k)).map((key)=>{
  //   const {
  //     name,
  //     hz,
  //     stats: { sample, rme },
  //   } = events[key];
  //   const size = sample.length;
  //   return {
  //     case: name,
  //     hz: Benchmark.formatNumber(hz.toFixed(hz < 100 ? 2 : 0)),
  //     hzs: hz,
  //     rme: `\xb1${rme.toFixed(2)}%`,
  //     sampled: `${size} run${size === 1 ? '' : 's'} sampled`,
  //   }
  // })
  const keys = Object.keys(suite) as (keyof Suite)[];
  return keys.reduce((result: RowDef[], key) => {
    if (/^\d{0,}$/g.test(key)) {
      const target = suite[key];
      if (target && target.stats) {
        const { name, hz, stats } = target;
        const { sample, rme } = stats;
        const size = sample.length;
        const formattedHz = Benchmark.formatNumber(Number(hz ? hz.toFixed(hz < 100 ? 2 : 0) : 0));
        result.push({
          case: name,
          hz: formattedHz,
          hzs: hz,
          rme: `\xb1${rme.toFixed(2)}%`,
          sampled: `${size} run${size === 1 ? '' : 's'} sampled`,
        });
      }
    }
    return result;
  }, []);
};

// 这个逻辑抽得很好，赞一个
// 不过，row 应该是上面的 ResultObject 类型？
const addRow = (row: RowDef[], isFastest: boolean): void => {
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
  // 下面这个 if 已经包含了上面第一个 if 的效果了
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
      generateRows((suite as any).filter('successful')).forEach((row: any) => {
        addRow(row, row.case === suite.filter('fastest').map('name')[0]);
      });
      p.printTable();
    });

  return suite;
};
