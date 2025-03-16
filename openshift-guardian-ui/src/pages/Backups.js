// Backups.jsx
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

  const handleDeleteSchedule = () => {
    navigate('/backups/delete-schedule-resource');
  };

  return (
    <div className={`backup-container ${darkMode ? 'dark' : ''}`}>
      <img
        src={guardianLogo}
        alt="Guardian Logo"
        className="guardian-logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
      />
      <header className="page-header">
        <h1>Manage Your Backups</h1>
      </header>
      <div className="backup-actions">
        <button className="btn create" onClick={handleCreateBackup}>
          Create Backup
        </button>
        <button className="btn view" onClick={handleViewBackups}>
          View All Backups
        </button>
        <button className="btn schedule" onClick={handleScheduleBackup}>
          Schedule Backup
        </button>
        <button className="btn delete" onClick={handleDeleteBackup}>
          Delete Backup
        </button>
        <button className="btn delete-schedule" onClick={handleDeleteSchedule}>
          Delete Schedule
        </button>
      </div>
    </div>
  );
};

export default Backups;