// src/pages/Restores.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Restores.css';

const Restores = () => {
  return (
    <div className="restores-container">
      <header className="restores-header">
        <h1>Restores</h1>
      </header>
      <main className="restores-content">
        <p>This is the Restores page. Here you can manage your restores.</p>
        {/* Future: Connect to the backend API */}
      </main>
      <footer className="restores-footer">
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </footer>
    </div>
  );
};

export default Restores;
