// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StaffLogin from './pages/StaffLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<StaffLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/backups" element={<Backups />} />
          <Route path="/restores" element={<Restores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
