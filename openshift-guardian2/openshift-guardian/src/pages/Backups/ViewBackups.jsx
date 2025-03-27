import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewBackups.css';
import guardianLogo from '../GUARDIAN.png';
import { verifyAuth } from '../../auth/useAuth.jsx'; // Import verifyAuth

const ViewBackups = ({ darkMode }) => {
  const [backups, setBackups] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // Added error state for better feedback
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        await verifyAuth(); // Redirects to login if unauthenticated
        const namespacesRes = await fetch('http://localhost:8000/get-user-namespaces', {
          credentials: 'include', // Include cookies for session authentication
        });
        if (!namespacesRes.ok) throw new Error('Failed to fetch namespaces');
        const namespacesData = await namespacesRes.json();
        setNamespaces(namespacesData.namespaces || []);
      } catch (error) {
        setError('Error fetching namespaces: ' + error.message);
        console.error('Error fetching namespaces:', error);
      } finally {
        setIsLoading(false);
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
        await verifyAuth(); // Redirects to login if unauthenticated
        const response = await fetch(`http://localhost:8000/get-backups?namespace=${selectedNamespace}`, {
          credentials: 'include', // Include cookies for session authentication
        });
        if (!response.ok) throw new Error('Failed to fetch backups');
        const data = await response.json();
        setBackups(data.backups || []);
        setError(''); // Clear error on success
      } catch (error) {
        setError('Error fetching backups: ' + error.message);
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

      {error && <p className="error">{error}</p>} {/* Display errors if any */}

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
            setBackups([]); // Clear backups while loading
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
        <p>Please select a namespace.</p>
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