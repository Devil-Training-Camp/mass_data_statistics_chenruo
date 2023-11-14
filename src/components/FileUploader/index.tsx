import React, { useRef, type ChangeEvent } from 'react';
import { calculateValuesByParams } from '../../utils/calculateValuesByParams';
import { calculateWeightStats } from '../../utils/calculateWeightStats';

interface Props {
  setStats: Function;
}

export const FileUploader = (props: Props): React.JSX.Element => {
  const { setStats } = props;
  // 这一块，文件选择 & 解析逻辑，建议抽成一个独立组建来做，放在 app 里面有悖”单一职责“原则
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (): void => {
    // 这里有点 trick，看着像是要 focus 在 input field？
    fileInputRef.current?.click();
  };

  // 代码格式还是写的很工整的，不错
  const handleFileLoad = (event: ProgressEvent<FileReader>): void => {
    try {
      const fileContent = event.target?.result;
      // 这里 parse 的是用户选择的文件，你很难保证必然就是 json，最好做个 try-catch 兜底
      const data = JSON.parse(fileContent as string);
      const regionData = calculateValuesByParams(data.nodes, ['region']);
      const resourceData = calculateValuesByParams(data.nodes, ['resource']);
      const regionByYearData = calculateValuesByParams(data.nodes, ['region', 'year']);
      const weightData = calculateWeightStats(data.nodes, 'weight');

      setStats({
        statsByRegion: regionData,
        statsByResource: resourceData,
        statsRegionByYear: regionByYearData,
        weightStats: weightData,
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('文件解析出错，请确保选择的文件是有效的 JSON 文件。');
    }
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
  return (
    <div>
      <button onClick={handleButtonClick}>上传文件</button>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
    </div>
  );
};
