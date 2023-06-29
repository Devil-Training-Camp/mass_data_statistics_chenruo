import React from 'react';
import './index.scss';
import { type RegionStats } from '../types';

interface TableProps {
  data: Record<string, RegionStats>;
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="table-container">
      <thead>
        <tr>
          <th>Region</th>
          <th>Count</th>
          <th>Sum</th>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
          <th>Median</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([region, stats]) => (
          <tr key={region}>
            <td>{region}</td>
            <td>{stats.count}</td>
            <td>{stats.sum}</td>
            <td>{stats.min}</td>
            <td>{stats.max}</td>
            <td>{stats.avg}</td>
            <td>{stats.median}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
