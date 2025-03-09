import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import guardianLogo from './GUARDIAN.png';
import './Dashboard.css';

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const applyPopEffect = location.state && location.state.fromLogin;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`dashboard-container ${applyPopEffect ? 'fade-in' : ''} ${darkMode ? 'dark' : ''}`}>
      <header className="dashboard-header">
        <div onClick={handleLogoClick}>
          <img
            src={guardianLogo}
            alt="Guardian Logo"
            className="guardian-logo"
            onClick={handleLogoClick}
          />
        </div>
        <p>Your Guardian is always watching—protecting your data 24/7.</p>
      </header>

      <section className="dashboard-stats">
        <div className="card">
          <h3>Total Backups</h3>
          <p>12</p>
        </div>
        <div className="card">
          <h3>Recent Restores</h3>
          <p>3</p>
        </div>
        <div className="card">
          <h3>System Status</h3>
          <p>Operational</p>
        </div>
      </section>

      <main className="dashboard-content">
        <div className="dashboard-links">
          <button className="btn" onClick={() => handleNavigation('/backups')}>Manage Backups</button>
          <button className="btn" onClick={() => handleNavigation('/restores')}>Manage Restores</button>
        </div>
      </main>

      <footer className="dashboard-footer">
      </footer>
    </div>
  );
};

export default Dashboard;