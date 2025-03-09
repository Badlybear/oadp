// components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // When Sign Out (Logout) is clicked, show our custom modal instead of calling window.confirm.
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // When user confirms logout
  const confirmLogout = () => {
    setShowConfirm(false);
    toggleSidebar(); // Closes the sidebar on sign out
    navigate("/");
  };

  // If user cancels logout
  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${darkMode ? 'dark' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? '✕' : '☰'}
      </button>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/backups" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Backups
        </NavLink>
        <NavLink 
          to="/restores" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Restores
        </NavLink>
        {/* Sign Out link still triggers the logout confirmation */}
        <NavLink 
          to="/"
          className={({ isActive }) => isActive ? 'nav-link logout active' : 'nav-link logout'}
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