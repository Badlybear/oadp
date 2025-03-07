import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Restores.css';
import guardianLogo from './GUARDIAN.png';

const Restores = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
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
        <button className="btn initiate">Initiate Restore</button>
        <button className="btn history">Restore History</button>
        <button className="btn settings">Restore Settings</button>
      </div>
    </div>
  );
};

export default Restores;