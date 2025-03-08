import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <span className="icon">🏠</span>
            <span className="label">Dashboard</span>
          </li>
          <li>
            <span className="icon">💾</span>
            <span className="label">Backups</span>
          </li>
          <li>
            <span className="icon">🔄</span>
            <span className="label">Restores</span>
          </li>
          <li>
            <span className="icon">⚙️</span>
            <span className="label">Settings</span>
          </li>
          <li>
            <span className="icon">📊</span>
            <span className="label">Monitoring</span>
          </li>
          <li>
            <span className="icon">📋</span>
            <span className="label">Logs</span>
          </li>
          <li>
            <span className="icon">👥</span>
            <span className="label">Users</span>
          </li>
          <li>
            <span className="icon">🔒</span>
            <span className="label">Security</span>
          </li>
          <li>
            <span className="icon">🌐</span>
            <span className="label">Networking</span>
          </li>
          <li>
            <span className="icon">🔔</span>
            <span className="label">Alerts</span>
          </li>
          <li>
            <span className="icon">🛠️</span>
            <span className="label">Tools</span>
          </li>
          <li>
            <span className="icon">📖</span>
            <span className="label">Documentation</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;