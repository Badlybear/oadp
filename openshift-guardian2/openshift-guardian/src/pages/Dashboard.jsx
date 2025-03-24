import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import guardianLogo from './GUARDIAN.png'; // Ensure this path is correct
import './Dashboard.css';

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const applyPopEffect = location.state && location.state.fromLogin;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`dashboard-container ${applyPopEffect ? 'fade-in' : ''} ${darkMode ? 'dark' : ''}`}>
      <header className="dashboard-header">
        <img
          src={guardianLogo}
          alt="Guardian Logo"
          className="dashboard-logo"
        />
        <h1>Openshift Guardian</h1>
        <p className="tagline">Your Guardian is always watching—protecting your data 24/7.</p>
      </header>

      <section className="dashboard-links">
        <button
          className="btn primary-btn large-btn"
          onClick={() => handleNavigation('/backups')}
        >
          Manage Backups
        </button>
        <button
          className="btn secondary-btn large-btn"
          onClick={() => handleNavigation('/restores')}
        >
          Manage Restores
        </button>
      </section>

      <main className="dashboard-content">
        {/* Empty content section for spacing */}
      </main>
    </div>
  );
};

export default Dashboard;