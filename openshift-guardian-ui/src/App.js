// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLogin from './pages/ClientLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    if (darkMode) {
      const handleMouseMove = (e) => {
        const offsetX = e.clientX / 100;
        const offsetY = e.clientY / 100;
        document.documentElement.style.setProperty('--bg-offset-x', `${offsetX}px`);
        document.documentElement.style.setProperty('--bg-offset-y', `${offsetY}px`);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
      document.documentElement.style.setProperty('--bg-offset-x', `0px`);
      document.documentElement.style.setProperty('--bg-offset-y', `0px`);
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <header className="main-header">
          <h1>Openshift Guardian</h1>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<ClientLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/backups" element={<Backups />} />
          <Route path="/restores" element={<Restores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
