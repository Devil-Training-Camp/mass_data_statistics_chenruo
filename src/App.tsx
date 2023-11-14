import React, { useState } from 'react';
import Table from './components/Table';
import { FileUploader } from './components/FileUploader';

const App = (): React.JSX.Element => {
  const [stats, setStats] = useState({
    statsByRegion: {},
    statsByResource: {},
    statsRegionByYear: {},
    weightStats: {
      max: 0,
      min: 0,
      median: 0,
    },
  });

  return (
    <div className="data-container">
      <FileUploader setStats={setStats} />
      <Table data={stats.statsByRegion} title={'region下value相关值'} sortParams={'Region'} />
      <Table data={stats.statsByResource} title={'resource下value相关值'} sortParams={'Resource'} />
      <Table data={stats.statsRegionByYear} title={'region下每年value相关值'} sortParams={'Region by year'} />
      {/* 下面这一段原则上也算是 data display，建议也抽成独立组件，虽然看起来确实比较简单 */}
      <div>
        <h5 style={{ marginTop: '20px' }}>数据集中，weight 最大值、最小值、中位值</h5>
        {[stats.weightStats].map((value, index) => {
          return (
            <ul key={index}>
              <li>max: {value.max}</li>
              <li>min: {value.min}</li>
              <li>median: {value.median}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default App;
