import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewBackups.css';
import guardianLogo from '../GUARDIAN.png';

const ViewBackups = ({ darkMode }) => {
  const [backups, setBackups] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const namespacesRes = await fetch('http://localhost:8000/get-user-namespaces');
        const namespacesData = await namespacesRes.json();
        setNamespaces(namespacesData.namespaces || []);
      } catch (error) {
        console.error('Error fetching namespaces:', error);
      }
    };

    fetchNamespaces();
  }, []);

  useEffect(() => {
    const fetchBackups = async () => {
      if (!selectedNamespace) {
        setBackups([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/get-backups?namespace=${selectedNamespace}`);
        const data = await response.json();
        setBackups(data.backups || []);
      } catch (error) {
        console.error('Error fetching backups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackups();
  }, [selectedNamespace]);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const filteredBackups = backups.filter((backup) =>
    backup.backup_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`view-backups-container ${darkMode ? 'dark' : ''}`}>
      <header className="page-header">
        <img
          src={guardianLogo}
          alt="Guardian Logo"
          className="app-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
        />
        <h1>View Backups</h1>
      </header>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search backups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="namespace-select-backups">
        <label htmlFor="namespace-select">Select Namespace:</label>
        <select
          id="namespace-select"
          value={selectedNamespace}
          onChange={(e) => {
            setSelectedNamespace(e.target.value);
            setBackups([]); // clear backups while loading
          }}
        >
          <option value="">-- Select Namespace --</option>
          {namespaces.map((ns) => (
            <option key={ns.name} value={ns.name}>
              {ns.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
  <div className="loader"></div>
) : !selectedNamespace ? (
  <p>No backups found.</p>
) : filteredBackups.length === 0 ? (
  <p>No backups found.</p>
) : (
  <div className="table-wrapper">
    <table className="backups-table">
      <thead>
        <tr>
          <th>Namespace</th>
          <th>Backup Name</th>
          <th>Time Created</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredBackups.map((backup, index) => (
          <tr key={index}>
            <td>{backup.namespace}</td>
            <td>{backup.backup_name}</td>
            <td>{backup['Time Created']}</td>
            <td className={`status ${backup.Status ? backup.Status.toLowerCase() : ''}`}>
              {backup.Status || 'Unknown'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default ViewBackups;
