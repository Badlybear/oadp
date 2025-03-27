import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBackupsOpen, setIsBackupsOpen] = useState(false);
  const [isRestoresOpen, setIsRestoresOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowConfirm(false);
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.classList.contains('confirm-modal')) {
        setShowConfirm(false);
      }
    };

    if (showConfirm) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showConfirm]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      // Call the logout endpoint to clear the session on the server
      const response = await fetch('http://localhost:8000/logout', {
        method: 'GET',
        credentials: 'include', // Include cookies to clear the session
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear any client-side state (optional, if you store anything locally)
      setShowConfirm(false);
      toggleSidebar(); // Close the sidebar
      navigate('/'); // Navigate to the root/login page
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally show an error message to the user
      setShowConfirm(false);
      toggleSidebar();
      navigate('/'); // Navigate anyway to ensure logout behavior
    }
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const toggleBackups = () => {
    setIsBackupsOpen(!isBackupsOpen);
  };

  const toggleRestores = () => {
    setIsRestoresOpen(!isRestoresOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${darkMode ? 'dark' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? '✕' : '☰'}
      </button>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Dashboard
        </NavLink>

        {/* Backups Section */}
        <div className="nav-section">
          <div className="nav-link nav-header" onClick={toggleBackups}>
            Backups
            <span className={`arrow ${isBackupsOpen ? 'open' : ''}`}>▼</span>
          </div>
          <div className={`submenu ${isBackupsOpen ? 'open' : ''}`}>
            <NavLink
              to="/backups/create-backup"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              Create Backup
            </NavLink>
            <NavLink
              to="/backups/view-backups"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              View Backups
            </NavLink>
            <NavLink
              to="/backups/schedule-backup"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              Schedule Backup
            </NavLink>
            <NavLink
              to="/backups/delete-backup"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              Delete Backup
            </NavLink>
            <NavLink
              to="/backups/delete-schedule-resource"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              Delete Schedule
            </NavLink>
          </div>
        </div>

        {/* Restores Section */}
        <div className="nav-section">
          <div className="nav-link nav-header" onClick={toggleRestores}>
            Restores
            <span className={`arrow ${isRestoresOpen ? 'open' : ''}`}>▼</span>
          </div>
          <div className={`submenu ${isRestoresOpen ? 'open' : ''}`}>
            <NavLink
              to="/restores/create-restore"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              Create Restore
            </NavLink>
            <NavLink
              to="/restores/view-restores"
              className={({ isActive }) => (isActive ? 'nav-link sub active' : 'nav-link sub')}
            >
              View Restores
            </NavLink>
          </div>
        </div>

        {/* Sign Out */}
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link logout active' : 'nav-link logout')}
          onClick={handleLogoutClick}
        >
          Sign Out
        </NavLink>
      </nav>

      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-dialog">
            <p>Are you sure you want to sign out?</p>
            <div className="confirm-actions">
              <button className="confirm-btn yes" onClick={confirmLogout}>Yes</button>
              <button className="confirm-btn no" onClick={cancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;