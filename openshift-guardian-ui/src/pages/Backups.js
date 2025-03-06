// src/pages/Backups.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Backups.css';

const Backups = () => (
  <div className="backups-container">
    <header className="backups-header">
      <h2>Backups</h2>
    </header>
    <main className="backups-content">
      <p>Here you can create and manage your backups.</p>
      {/* Future: API integration for backups */}
    </main>
    <footer className="backups-footer">
      <Link to="/dashboard" className="btn">Back to Dashboard</Link>
    </footer>
  </div>
);

export default Backups;
