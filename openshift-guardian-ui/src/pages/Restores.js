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
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
      />
      <header className="page-header">
        <h1>Manage Your Restores</h1>
      </header>
      <div className="restore-actions">
        <button className="btn create" onClick={handleCreateRestore}>
          Create Restore
        </button>
        <button className="btn view" onClick={handleViewRestores}>
          View Restores
        </button>
      </div>
    </div>
  );
};

export default Restores;