// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClientLogin from './pages/ClientLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

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
          <Route path="/" element={<Home />} />
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
