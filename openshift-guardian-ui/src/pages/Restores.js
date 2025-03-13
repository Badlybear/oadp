import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Restores.css';
import guardianLogo from './GUARDIAN.png';

const Restores = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleCreateRestore = () => {
    navigate('/restores/create-restore');
  };

  const handleViewRestores = () => {
    navigate('/restores/view-restores');
  };

  return (
    <div className={`restore-container ${darkMode ? 'dark' : ''}`}>
      <img
        src={guardianLogo}
        alt="Guardian Logo"
        className="guardian-logo"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <h1>Manage Your Restores</h1>
      <div className="restore-actions">
        <button className="btn primary-btn" onClick={handleCreateRestore}>
          Initiate Restore
        </button>
        <button className="btn secondary-btn" onClick={handleViewRestores}>
          Restore History
        </button>
      </div>
    </div>
  );
};

export default Restores;