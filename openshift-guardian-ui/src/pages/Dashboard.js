import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import guardianLogo from './GUARDIAN.png';
import './Dashboard.css';

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine whether to apply the pop effect based on navigation state.
  const applyPopEffect = location.state && location.state.fromLogin;

  const handleNavigation = (path) => {
    // Direct navigation without any transition; subsequent navigations don't need the pop.
    navigate(path);
  };

  return (
    // Add the "fade-in" class only if coming from Login (applyPopEffect is true)
    <div className={`dashboard-container ${applyPopEffect ? 'fade-in' : ''} ${darkMode ? 'dark' : ''}`}>
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