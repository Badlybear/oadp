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
        const response = await fetch('http://localhost:8000/get-backups');
        const data = await response.json();
        setBackups(data.backups); // ✅ Corrected to access 'backups' key in response
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
          className="app-logo"
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
                <th>Namespace</th>
                <th>Backup Name</th>
                <th>Time Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
  {backups.map((backup, index) => (
    <tr key={index}>
      <td>{backup.namespace}</td>
      <td>{backup.backup_name}</td>
      <td>{backup["Time Created"]}</td>
      <td className={`status ${backup.Status ? backup.Status.toLowerCase() : ''}`}>
        {backup.Status || 'Unknown'}
      </td>
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