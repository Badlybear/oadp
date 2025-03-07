// src/pages/Backups.js
import React from 'react';
import './Backups.css';

const Backups = () => (
  <div className="backup-container">
    <h2>Manage Your Backups</h2>
    <div className="backup-actions">
      <button className="btn create">Create Backup</button>
      <button className="btn view">View All Backups</button>
      <button className="btn schedule">Schedule Backup</button>
    </div>
  </div>
);

export default Backups;
