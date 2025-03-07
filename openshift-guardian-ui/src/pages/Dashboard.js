// src/pages/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import guardianLogo from './GUARDIAN.png';
import './Dashboard.css';

const Dashboard = ({ darkMode }) => {
  const [fadeTransition, setFadeTransition] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setFadeTransition(true);
    setTimeout(() => {
      navigate(path);
    }, 500); // 0.5s fade-out transition
  };

  return (
    <div className={`dashboard-container page-transition ${fadeTransition ? 'fade-out' : ''} ${darkMode ? 'dark' : ''}`}>
      <header className="dashboard-header">
        <img src={guardianLogo} alt="Guardian Logo" className="guardian-logo" />
        <h2>Openshift Guardian</h2>
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
          <button className="btn" onClick={() => handleNavigation('/')}>Logout</button>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Openshift Guardian</p>
      </footer>
    </div>
  );
};

export default Dashboard;
