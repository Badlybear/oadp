import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Backups.css';
import guardianLogo from './GUARDIAN.png';

const Backups = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
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
        <button className="btn create">Create Backup</button>
        <button className="btn view">View All Backups</button>
        <button className="btn schedule">Schedule Backup</button>
      </div>
    </div>
  );
};

export default Backups;