// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLogin from './pages/ClientLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      const handleMouseMove = (e) => {
        const offsetX = (e.clientX / window.innerWidth - 0.5) * 10;
        const offsetY = (e.clientY / window.innerHeight - 0.5) * 10;
        document.documentElement.style.setProperty('--bg-offset-x', `${offsetX}px`);
        document.documentElement.style.setProperty('--bg-offset-y', `${offsetY}px`);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <header className="main-header">
          <h1>Openshift Guardian</h1>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<ClientLogin />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/backups" element={<Backups darkMode={darkMode} />} />
          <Route path="/restores" element={<Restores darkMode={darkMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
