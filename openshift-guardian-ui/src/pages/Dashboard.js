// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Staff Dashboard</h1>
      </header>
      <main className="dashboard-content">
        <p>Welcome to the Openshift Guardian staff dashboard!</p>
        <div className="dashboard-links">
          <Link to="/backups" className="btn">Backups</Link>
          <Link to="/restores" className="btn">Restores</Link>
        </div>
        <Link to="/" className="btn">Back to Home</Link>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; 2025 Openshift Guardian</p>
      </footer>
    </div>
  );
};

export default Dashboard;
