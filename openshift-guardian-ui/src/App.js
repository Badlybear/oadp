import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ClientLogin from './pages/ClientLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import Sidebar from './Sidebar';
import './App.css';


// Backup Pages
import CreateBackup from './pages/Backups/CreateBackup';
import ViewBackups from './pages/Backups/ViewBackups';
import ScheduleBackup from './pages/Backups/ScheduleBackup';
import DeleteBackup from './pages/Backups/DeleteBackup';
import DeleteScheduleResource from './pages/Backups/DeleteScheduleResource'; // New component

// Restore Pages
import CreateRestore from './pages/Restores/CreateRestore'; // New component
import ViewRestores from './pages/Restores/ViewRestores'; // New component

const AppLayout = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith('/login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {!isLoginPage && (
        <>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
          />
          <header className="main-header">
            <h1>Openshift Guardian</h1>
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </header>
        </>
      )}

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<ClientLogin darkMode={darkMode} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/backups" element={<Backups darkMode={darkMode} />} />
          <Route path="/backups/create-backup" element={<CreateBackup darkMode={darkMode} />} />
          <Route path="/backups/view-backups" element={<ViewBackups darkMode={darkMode} />} />
          <Route path="/backups/schedule-backup" element={<ScheduleBackup darkMode={darkMode} />} />
          <Route path="/backups/delete-backup" element={<DeleteBackup darkMode={darkMode} />} />
          <Route path="/backups/delete-schedule-resource" element={<DeleteScheduleResource darkMode={darkMode} />} />
          <Route path="/restores" element={<Restores darkMode={darkMode} />} />
          <Route path="/restores/create-restore" element={<CreateRestore darkMode={darkMode} />} />
          <Route path="/restores/view-restores" element={<ViewRestores darkMode={darkMode} />} />
        </Routes>
      </div>

      {!isLoginPage && (
        <footer className="page-footer">
          <p>© 2025 Openshift Guardian</p>
        </footer>
      )}
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <AppLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </Router>
  );
}

export default App;