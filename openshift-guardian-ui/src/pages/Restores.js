// src/pages/Restores.js
import React from 'react';
import './Restores.css';

const Restores = () => (
  <div className="restore-container">
    <h2>Manage Your Restores</h2>
    <div className="restore-actions">
      <button className="btn initiate">Initiate Restore</button>
      <button className="btn history">Restore History</button>
      <button className="btn settings">Restore Settings</button>
    </div>
  </div>
);

export default Restores;
