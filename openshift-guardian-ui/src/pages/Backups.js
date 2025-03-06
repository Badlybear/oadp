// src/pages/Backups.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Backups.css';

const Backups = () => {
  return (
    <div className="backups-container">
      <header className="backups-header">
        <h1>Backups</h1>
      </header>
      <main className="backups-content">
        <p>This is the Backups page. Here you can manage your backups.</p>
        {/* Future: Connect to the backend API */}
      </main>
      <footer className="backups-footer">
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </footer>
    </div>
  );
};

export default Backups;
