// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLogin from './pages/ClientLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      const handleMouseMove = (e) => {
        // Calculate a small offset for a subtle parallax effect
        const offsetX = (e.clientX / window.innerWidth - 0.5) * 20;
        const offsetY = (e.clientY / window.innerHeight - 0.5) * 20;
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
            {darkMode ? (
              // Dark mode active: show half-moon icon (styled in grey/black)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#888" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
              </svg>
            ) : (
              // Light mode active: show sun icon
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f39c12" viewBox="0 0 24 24">
                <path d="M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zm5.657 3.343a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L17.657 6.757a1 1 0 010-1.414zM22 11a1 1 0 010 2h-2a1 1 0 010-2h2zm-3.343 5.657a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM12 20a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zm-5.657-1.343a1 1 0 010 1.414L4.93 21.485a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM2 13a1 1 0 010-2h2a1 1 0 010 2H2zm3.343-5.657a1 1 0 011.414 0L8.17 8.17a1 1 0 01-1.414 1.414L4.757 8.757a1 1 0 010-1.414zM12 6a6 6 0 100 12 6 6 0 000-12z"/>
              </svg>
            )}
          </button>
        </header>
        <div className="page-transition">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<ClientLogin darkMode={darkMode} />} />
            <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
            <Route path="/backups" element={<Backups darkMode={darkMode} />} />
            <Route path="/restores" element={<Restores darkMode={darkMode} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
