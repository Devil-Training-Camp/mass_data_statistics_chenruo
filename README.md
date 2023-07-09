# 大量数据统计项目总结

## intro

本项目旨在用于对数据集进行统计分析。用户可以通过该页面选择本地文件作为数据源，系统将对选定的数据集进行统计计算，并最终以直观的方式展示分析结果。实现对数据集的统计分析功能，包括计算平均值、最大值、最小值、中位值、总和等指标。

1. 支持按照不同的分类方式（如区域、资源类型等）进行分组统计。

2. 理解和实现多年份统计功能，即按 region 分组、按年份分组分别计算统计结果。

3. 实现按资源分类统计功能，即按 resource 分类计算统计结果。

4. 添加展示 weight 最大值、最小值、中位值的功能。

## 主要功能

1. 文件上传与数据处理: 用户可以在页面上选择本地文件，前端将对上传的文件进行解析和数据处理，提取出需要的字段和数值。

2. 基本统计分析: 根据用户选择的数据集，系统将计算并展示各个分类标准下的指标统计结果，如平均值、最大值、最小值、中位值、总和等。

3. 按分类方式进行分组统计: 用户可以选择不同的分类方式（如区域、年份、资源类型等）来对数据集进行分组统计，以获得更加细粒度和具体的统计结果。

4. 高级统计功能: 除了基本的统计指标外，系统还提供一些高级统计功能，如对 weight 最大值、最小值、中位值的分析，以帮助用户更加全面地理解数据集。

## 如何使用

### 1. 启动项目

`pnpm i`

`pnpm start`

### 2. 函数性能测试

`pnpm test`

![image-20230708124057118](https://raw.githubusercontent.com/linhaishe/blogImageBackup/main/coop/image-20230708124057118.png)

## 页面展示

是一个非常简单的页面

![image-20230708124322429](https://raw.githubusercontent.com/linhaishe/blogImageBackup/main/coop/image-20230708124322429.png)

![image-20230708124424736](https://raw.githubusercontent.com/linhaishe/blogImageBackup/main/coop/image-20230708124424736.png)

## 文件上传与数据处理

```js
const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  // 检查文件类型
  if (file.type !== 'application/json') {
    alert('只能上传 JSON 文件');
    return;
  }

  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(file);
};
```

从事件中获取选择的文件对象，即 event.target.files?.[0]。

如果没有选择文件，函数将直接返回。

检查文件的类型是否为 application/json，如果不是，则弹出提示框提醒用户只能上传 JSON 文件，并返回。

创建一个 FileReader 实例。

将 handleFileLoad 函数设置为 reader.onload 的回调函数，用于在文件加载完成时处理文件内容。

使用 reader.readAsText(file) 方法读取文件的文本内容。

## 数据处理

分析数据处理的步骤，包括根据 region 分组、计算平均值、最大值、最小值、中位值、总和等。

```js
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

const groupBy = <T extends keyof DataObject>(data: DataObject[], keys: T[]): Record<string, DataObject[]> => {
  return data.reduce((groups: any, obj: DataObject) => {
    const groupKey = keys.map((key: T) => obj[key]).join('-');
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
      sum: group.reduce((sum: number, obj: DataObject) => sum + obj.value, 0),
    };

    result[key] = statistics;
  }

  return result;
};
```

这段代码主要包含以下几个函数和一个导出的函数：

`groupBy 函数`：根据指定的键值将数据分组。`groupBy 函数`使用数组的 `reduce `方法遍历数据并按照指定的键值进行分组，最终返回一个以分组键为 key、对应数据数组为 value 的对象。

`calculateAverage 函数`：计算数组中数值的平均值。`calculateAverage 函数`使用数组的 `reduce` 方法将数组中所有数值累加起来，然后除以数组长度得到平均值。

`calculateMedian 函数`：计算数组中数值的中位数。`calculateMedian 函数`首先对数组进行排序，并根据数组长度的奇偶性选择相应的中位数计算方式，返回中位数的值。

`calculateValuesByParams 函数`：根据指定的分组键计算统计数据。`calculateValuesByParams 函数`通过调用` groupBy 函数`将数据分组，然后遍历每个分组计算平均值、最大值、最小值、中位数和总和等统计数据，并将结果存储在一个对象中并返回。

整个代码的目的是对给定的数据对象数组进行分组，并根据指定的分组键计算每个分组的平均值、最大值、最小值、中位数和总和等统计数据，并以对象的形式返回这些统计数据。

```ts
const calculateValuesByParams = <T extends keyof DataObject>(data: DataObject[], groupByKeys: T[]): any => {};
```

这段代码使用了泛型（generics）来增强类型安全性，并且使用了 TypeScript 的语法。如果你不熟悉 TypeScript，也可以将代码中的 `<T extends keyof DataObject> `替换为实际的类型（例如 string），并将返回类型 any 替换为合适的类型。

```js
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
```

这段代码定义了一个名为` calculateWeightStats 的函数`，它接受一个包含数据对象的数组和一个指定权重字段的参数。函数的目的是计算给定权重字段在数据数组中的最大值、最小值和中位数。

函数内部的主要逻辑如下：

首先，通过使用 map 方法将数据数组中每个对象的权重字段值提取出来，并转换为 number 数组。

然后，使用 Math.max 和 Math.min 方法分别计算权重数组中的最大值和最小值。

接下来，对权重数组进行排序，并获取数组的长度。

最后，根据数组长度的奇偶性，计算出中位数。如果数组长度为偶数，则取中间两个数的平均值作为中位数；如果数组长度为奇数，则取中间的数作为中位数。

将最大值、最小值和中位数组成一个对象，并作为函数的返回值。

这段代码的作用是根据指定的权重字段，计算给定数据数组中该字段的最大值、最小值和中位数，并以对象形式返回。

代码中使用了 TypeScript 的类型注解和泛型，其中 keyof Data 表示权重字段必须是 Data 接口中的属性之一。

## 函数性能测试

```js
// ./src/utils/benchmark.ts
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
    if (/^\\d{0,}$/g.test(key)) {
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
        rme: `\\xb1${rme.toFixed(2)}%`,
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
```

```js
//  benchmark/index.ts
// 后续可以直接编写测试用例，不再关注主结构编写
/**
 * run pnpm test
 */

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
```

通过基准测试（benchmark）的工具函数，用于比较不同测试用例的性能。使用了 `Benchmark.js 库`来运行性能测试，并使用` console-table-printer`和 `ora `等库来显示测试结果和进度条。

代码中的` benchmarkSuite 函数`是这个工具的核心部分，它接受一个包含测试用例的数组作为参数，并返回一个` Benchmark.Suite 实例`。

函数首先检查传入的测试用例是否正确，然后遍历测试用例数组，将每个测试用例添加到 `Benchmark.Suite `实例中。然后，函数设置了一些监听器，包括 `'cycle' 和 'complete' `事件。

在测试过程中，每当一个测试用例完成一次循环时，会触发`'cycle'`事件，函数会通过` ora 库`显示当前测试用例的完成情况，并开始下一个测试用例的测试。

所有测试用例完成后，会触发`'complete'`事件。在该事件处理程序中，函数使用` getRows 函数`从成功的测试用例中提取出每个测试用例的结果信息，并使用 `addRow 函数`将结果添加到 `console-table-printer` 中。最后，调用`p.printTable()`方法打印测试结果表格。

整个过程中使用了一些辅助函数和数据类型定义，用于格式化输出和处理测试结果。

实现了一个简单的基准测试工具函数，可以方便地对多个测试用例进行性能比较，并以表格形式输出测试结果。

## 火焰图

![image-20230708135132109](https://raw.githubusercontent.com/linhaishe/blogImageBackup/main/coop/image-20230708135132109.png)

## 待优化

1. 数据量级偏大的时候，应考虑 webworker 处理数据 或 将数据传给服务端处理
2. 针对多位数的数据特殊处理（不知道要处理什么，面试的时候遇到过一个问题，如果给你一个很大的数据你会怎么处理？）
3. 可以引入 mock.js 模拟大数据场景
4. 可以使用快速算法做更好的计算实现
5. 文件类型检查：当前代码中使用 file.type !== 'application/json' 进行文件类型检查。这种方式只适用于检查文件的 MIME 类型，而不是文件扩展名。可以考虑改为使用正则表达式或其他更灵活的方式，以支持更多的 JSON 文件类型定义。
6. 错误处理：当前代码中如果发生错误，比如读取文件失败，没有提供错误处理。可以添加错误处理逻辑，例如在读取文件失败时显示一个错误提示，并可能记录错误日志。
7. 异步操作：FileReader 是异步读取文件内容的，但当前代码并没有利用其异步能力。可以使用 Promise、async/await 或回调函数等方式进行异步处理，以便更好地控制文件加载过程和处理结果。
8. 性能优化：如果需要处理大型 JSON 文件，可以考虑使用流式读取（streaming）的方式，而不是一次性将整个文件读入内存。这样可以减少内存占用，并提高对大文件的处理性能。

## 遇到的问题

1. benchmark 的使用

   [Measuring Javascript Code Performance With Benchmark.js](https://webmobtuts.com/javascript/measuring-javascript-code-performance-with-benchmark-js/)

   [Benchmark.js](https://benchmarkjs.com/docs/)

   [Bulletproof JavaScript benchmarks](https://calendar.perfplanet.com/2010/bulletproof-javascript-benchmarks/)

   [上手 JavaScript 基准测试](https://juejin.cn/post/7073839540040892452)

2. benchmark.js vs performanceAPI vs jest

   1. Benchmark.js（性能测试库）： Benchmark.js 是一个专门用于测试 JavaScript 代码性能的库。它提供了一种测量各种函数或代码片段性能的方法，帮助您分析执行时间并确定潜在的性能瓶颈。Benchmark.js 提供了简单灵活的 API，用于创建、运行和比较性能测试。Benchmark.js 主要用于性能测试和优化的目的。
   2. Performance API（性能 API）： Performance API 是现代浏览器内置的一组 Web API，用于公开各种性能相关的指标和时间信息。它允许开发人员访问和分析性能数据，可以获取关于页面加载时间、资源加载时间、网络请求等方面的信息。通过 Performance API，您可以更深入地了解应用程序的性能情况，从而进行优化和改进。
   3. Jest（测试框架）： Jest 是一个功能强大的 JavaScript 测试框架，特别适用于单元测试和集成测试。它提供了一套简单且易于使用的 API 和工具，可以编写、运行和管理各种类型的测试用例。Jest 具有丰富的功能，如断言库、模拟函数、覆盖率报告等。它还提供了一些特殊功能，如快照测试和并行测试执行。Jest 可以帮助您确保代码的正确性，并提供开发人员友好的测试体验。

3. 超多 ts 报错问题

   引入的 ts 非常严格，有些严格到我将提醒级别降低了。或者在整个文件 ignore 了。应该是引入的第三方 tslint 太严格了，应该使用 airbnb 的。

4. 引入无后缀/ts 的文件会报错找不到，只能以 js 后缀写入（未解决

```js
import { benchmarkSuite } from '../src/utils/benchmark.js';
import { calculateValuesByParams } from '../src/utils/calculateValuesByParams.js';
import { calculateWeightStats } from '../src/utils/calculateWeightStats.js';

// 引入无后缀的文件会报错找不到
```

| 库                    | 版本   | 描述                                                                                 |
| --------------------- | ------ | ------------------------------------------------------------------------------------ |
| Chalk                 | 4.1.0  | 为终端输出添加样式的库，提供丰富的颜色、背景颜色和文本修饰符。                       |
| Console Table Printer | 2.10.0 | 在终端打印漂亮表格的库，支持自定义样式和列宽度调整，用于展示统计结果和格式化输出。   |
| Microtime             | 3.0.0  | 用于精确测量时间的库，提供获取当前时间戳的功能，精确到微秒级别。                     |
| Ora                   | 5.1.0  | 在终端展示加载动画和提示信息的库，支持自定义加载动画和文本，用于展示进度和状态信息。 |

## refs

1. [markdown/perf/一文学会利用 Chrome Dev Tools 进行页面性能分析.md](https://github.com/LuckyWinty/blog/blob/master/markdown/perf/%E4%B8%80%E6%96%87%E5%AD%A6%E4%BC%9A%E5%88%A9%E7%94%A8Chrome%20Dev%20Tools%20%E8%BF%9B%E8%A1%8C%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90.md)
