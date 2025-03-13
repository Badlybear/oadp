import React, { useState, useEffect } from 'react';
import './ViewRestores.css';

const ViewRestores = ({ darkMode }) => {
  const [restores, setRestores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestores = async () => {
      try {
        setIsLoading(true);
        const mockRestores = [
          { id: 1, name: 'Restore_001', timeCreated: '2025-03-11 10:00:00', status: 'Completed' },
          { id: 2, name: 'Restore_002', timeCreated: '2025-03-12 15:30:00', status: 'Failed' },
        ];
        setRestores(mockRestores);
      } catch (error) {
        console.error('Error fetching restores:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestores();
  }, []);

  return (
    <div className={`view-restores-container ${darkMode ? 'dark' : ''}`}>
      <h1>View Restores</h1>
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : restores.length === 0 ? (
        <p>No restores found.</p>
      ) : (
        <table className="restores-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {restores.map((restore) => (
              <tr key={restore.id}>
                <td>{restore.name}</td>
                <td>{restore.timeCreated}</td>
                <td className={`status ${restore.status.toLowerCase()}`}>{restore.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewRestores;