import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewBackups.css';
import guardianLogo from '../GUARDIAN.png';

const ViewBackups = ({ darkMode }) => {
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        setIsLoading(true);
        const mockBackups = [
          { id: 1, name: 'Backup_001', timeCreated: '2025-03-10 14:30:00', status: 'Completed', expirationDate: '2025-04-10' },
          { id: 2, name: 'Backup_002', timeCreated: '2025-03-11 09:15:00', status: 'Failed', expirationDate: '2025-04-11' },
          { id: 3, name: 'Backup_003', timeCreated: '2025-03-12 22:45:00', status: 'Completed', expirationDate: '2025-04-12' },
        ];
        setBackups(mockBackups);
      } catch (error) {
        console.error('Error fetching backups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackups();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`view-backups-container ${darkMode ? 'dark' : ''}`}>
      <header className="page-header">
        <img
          src={guardianLogo}
          alt="Guardian Logo"
          className="guardian-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
        />
        <h1>View Backups</h1>
      </header>
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : backups.length === 0 ? (
        <p>No backups found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="backups-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Time Created</th>
                <th>Status</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id}>
                  <td>{backup.name}</td>
                  <td>{backup.timeCreated}</td>
                  <td className={`status ${backup.status.toLowerCase()}`}>{backup.status}</td>
                  <td>{backup.expirationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewBackups;