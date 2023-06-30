import React from 'react';
import './index.scss';
import { type RegionStats } from '../types';

interface TableProps {
  data: Record<string, RegionStats>;
  title: string;
  sortParams: string;
}

const Table: React.FC<TableProps> = ({ data, title, sortParams }) => {
  return (
    <>
      <h5 style={{ marginTop: '20px' }}>{title}</h5>
      <table className="table-container">
        <thead>
          <tr>
            <th>{sortParams}</th>
            <th>Sum</th>
            <th>Min</th>
            <th>Max</th>
            <th>Avg</th>
            <th>Median</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([type, stats]) => (
            <tr key={type}>
              <td>{type}</td>
              <td>{stats.sum}</td>
              <td>{stats.minimum}</td>
              <td>{stats.maximum}</td>
              <td>{stats.average}</td>
              <td>{stats.median}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
