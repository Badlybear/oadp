import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewRestores.css';
import guardianLogo from '../GUARDIAN.png'; // Adjust path as needed

const ViewRestores = ({ darkMode }) => {
  const [restores, setRestores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestores = async () => {
      try {
        setIsLoading(true);
        const mockRestores = [
          { id: 1, name: 'Restore_001', timeCreated: '2025-03-11 10:00:00', status: 'Completed', namespace: 'Namespace 1' },
          { id: 2, name: 'Restore_002', timeCreated: '2025-03-12 15:30:00', status: 'Failed', namespace: 'Namespace 2' },
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

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`view-restores-container ${darkMode ? 'dark' : ''}`}>
      <header className="page-header">
        <img
          src={guardianLogo}
          alt="Guardian Logo"
          className="app-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
        />
        <h1>View Restores</h1>
      </header>
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : restores.length === 0 ? (
        <p>No restores found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="restores-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Time Created</th>
                <th>Status</th>
                <th>Namespace</th>
              </tr>
            </thead>
            <tbody>
              {restores.map((restore) => (
                <tr key={restore.id}>
                  <td>{restore.name}</td>
                  <td>{restore.timeCreated}</td>
                  <td className={`status ${restore.status.toLowerCase()}`}>{restore.status}</td>
                  <td>{restore.namespace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRestores;