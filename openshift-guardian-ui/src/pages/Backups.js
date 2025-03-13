import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Backups.css';
import guardianLogo from './GUARDIAN.png';

const Backups = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleDeleteBackup = () => {
    navigate('/backups/delete-backup');
  };

  const handleCreateBackup = () => {
    navigate('/backups/create-backup');
  };

  const handleViewBackups = () => {
    navigate('/backups/view-backups');
  };

  const handleScheduleBackup = () => {
    navigate('/backups/schedule-backup');
  };

  return (
    <div className={`backup-container ${darkMode ? 'dark' : ''}`}>
      <img
        src={guardianLogo}
        alt="Guardian Logo"
        className="guardian-logo"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <h1>Manage Your Backups</h1>
      <div className="backup-actions">
        <button className="btn create" onClick={handleCreateBackup}>Create Backup</button>
        <button className="btn view" onClick={handleViewBackups}>View All Backups</button>
        <button className="btn schedule" onClick={handleScheduleBackup}>Schedule Backup</button>
        <button className="btn delete" onClick={handleDeleteBackup}>Delete Backup</button>
      </div>
    </div>
  );
};

export default Backups;