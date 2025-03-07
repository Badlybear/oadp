// src/pages/Backups.js
import React from 'react';
import './Backups.css';

const Backups = ({ darkMode }) => (
  <div className={`backup-container ${darkMode ? 'dark' : ''}`}>
    <h2>Manage Your Backups</h2>
    <div className="backup-actions">
      <button className="btn create">Create Backup</button>
      <button className="btn view">View All Backups</button>
      <button className="btn schedule">Schedule Backup</button>
    </div>
  </div>
);

export default Backups;
