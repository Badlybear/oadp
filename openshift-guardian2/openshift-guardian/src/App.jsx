import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ClientLogin from './pages/ClientLogin';
import Dashboard from './pages/Dashboard';
import Backups from './pages/Backups';
import Restores from './pages/Restores';
import Sidebar from './Sidebar';
import './App.css';
import Doc from './pages/Doc';
import Splunk from './pages/Splunk';

// Backup Pages
import CreateBackup from './pages/Backups/CreateBackup';
import ViewBackups from './pages/Backups/ViewBackups';
import ScheduleBackup from './pages/Backups/ScheduleBackup';
import DeleteBackup from './pages/Backups/DeleteBackup';
import DeleteScheduleResource from './pages/Backups/DeleteScheduleResource';

// Restore Pages
import CreateRestore from './pages/Restores/CreateRestore';
import ViewRestores from './pages/Restores/ViewRestores';

// DocLayout - A separate layout component for the Doc page
const DocLayout = ({ darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        darkMode={darkMode} 
      />
      <div className="doc-content">
        <Doc darkMode={darkMode} />
      </div>
    </div>
  );
};

const AppLayout = ({ darkMode, toggleDarkMode, user }) => {
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
            <div className="user-info">
              {user ? (
                <p>Connected as: <strong>{user.name || user.email}</strong></p>
              ) : null}
            </div>
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
          <Route path="/splunk" element={<Splunk darkMode={darkMode} />} />
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
  const [user, setUser] = useState(null);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/doc" element={<DocLayout darkMode={darkMode} />} />
        <Route path="*" element={<AppLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;