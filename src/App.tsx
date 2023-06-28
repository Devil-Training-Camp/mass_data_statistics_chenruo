import React, { useRef, type ChangeEvent, useState } from 'react';
import './index.scss';
import { type RegionStats } from './components/types';
import Table from './components/table';
import { calculateStatsByRegion } from './utils/calculateStatsByRegion';

const App = (): React.JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statsByRegion, setStatsByRegion] = useState<
    Record<string, RegionStats>
  >({});

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
    const result = calculateStatsByRegion(data.nodes);
    setStatsByRegion(result);
  };

  return (
    <h1 className="test-class">
      <button onClick={handleButtonClick}>上传文件</button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <Table data={statsByRegion} />
    </h1>
  );
};

export default App;
