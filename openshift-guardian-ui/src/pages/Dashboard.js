// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => (
  <div className="dashboard-container">
    <header className="dashboard-header">
      <h2>Client Dashboard</h2>
    </header>
    <main className="dashboard-content">
      <p>Welcome! Use the links below to manage your backups and restores.</p>
      <div className="dashboard-links">
        <Link to="/backups" className="btn">Backups</Link>
        <Link to="/restores" className="btn">Restores</Link>
      </div>
      <Link to="/" className="btn">Home</Link>
    </main>
    <footer className="dashboard-footer">
      <p>&copy; 2025 Openshift Guardian</p>
    </footer>
  </div>
);

export default Dashboard;
