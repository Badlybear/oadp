// src/pages/Restores.js
import React from 'react';
import './Restores.css';

const Restores = ({ darkMode }) => (
  <div className={`restore-container ${darkMode ? 'dark' : ''}`}>
    <h1>Manage Your Restores</h1>
    <div className="restore-actions">
      <button className="btn initiate">Initiate Restore</button>
      <button className="btn history">Restore History</button>
      <button className="btn settings">Restore Settings</button>
    </div>
  </div>
);

export default Restores;
