import React, { useRef, type ChangeEvent, useState } from 'react';
import './index.scss';
import { type RegionStats } from './components/types';
import Table from './components/table';
import { calculateValuesByParams } from './utils/calculateValuesByParams';
import { calculateWeightStats } from './utils/calculateWeightStats';

const App = (): React.JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statsByRegion, setStatsByRegion] = useState<Record<string, RegionStats>>({});
  const [statsByresource, setStatsByresource] = useState<Record<string, RegionStats>>({});
  const [statsRegionByYear, setStatsRegionByYear] = useState<Record<string, RegionStats>>({});
  const [weightStats, setweightStats] = useState<{
    max: number;
    min: number;
    median: number;
  }>({
    max: 0,
    min: 0,
    median: 0,
  });

  const handleButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file == null) {
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

  const handleFileLoad = (event: ProgressEvent<FileReader>): void => {
    const fileContent = event.target?.result;
    const data = JSON.parse(fileContent as string);

    const regionData = calculateValuesByParams(data.nodes, ['region']);
    setStatsByRegion(regionData);

    const resourceData = calculateValuesByParams(data.nodes, ['resource']);
    setStatsByresource(resourceData);

    const regionByYearData = calculateValuesByParams(data.nodes, ['region', 'year']);
    setStatsRegionByYear(regionByYearData);

    const wightData = calculateWeightStats(data.nodes, 'weight');
    setweightStats(wightData);
  };

  return (
    <div className="data-container">
      <button onClick={handleButtonClick}>上传文件</button>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
      <Table data={statsByRegion} title={'region下value相关值'} sortParams={'Region'} />
      <Table data={statsByresource} title={'resource下value相关值'} sortParams={'Resource'} />
      <Table data={statsRegionByYear} title={'region下每年value相关值'} sortParams={'Region by year'} />
      <div>
        <h5 style={{ marginTop: '20px' }}>数据集中，weight 最大值、最小值、中位值</h5>
        {[weightStats].map((value, index) => {
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
