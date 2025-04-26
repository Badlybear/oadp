import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteBackup.css';
import guardianLogo from '../GUARDIAN.png';
import { verifyAuth } from '../../auth/useAuth.jsx';

const DeleteBackup = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [selectedBackup, setSelectedBackup] = useState('');
  const [namespaces, setNamespaces] = useState([]);
  const [backups, setBackups] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        const currentUser = await verifyAuth(); // 🔒 בדיקת התחברות
        const response = await fetch('http://localhost:8000/get-user-namespaces', {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch namespaces.');
        }
        
        const data = await response.json();
        setNamespaces(data.namespaces);
      } catch (error) {
        setMessage('Error fetching namespaces.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNamespaces();
  }, []);

  const fetchBackupsByNamespace = async (namespace) => {
    try {
      await verifyAuth(); // Ensure this works with your auth logic
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/get-backups?namespace=${namespace}`, {
        credentials: 'include', // Include cookies/session for authentication
      });
      if (res.status === 401) {
        window.location.href = '/login'; // Redirect to login page
        return;
      }
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (error) {
      console.error('Error:', error.message);
      setMessage(`Error fetching backups: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNamespaceChange = (e) => {
    const ns = e.target.value;
    setSelectedNamespace(ns);
    setSelectedBackup('');
    setMessage('');
    if (ns) {
      fetchBackupsByNamespace(ns);
    } else {
      setBackups([]);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleDeleteBackup = async () => {
    if (!selectedNamespace || !selectedBackup) {
      setMessage('Please select a namespace and a backup to delete.');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/delete-backup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies/session for authentication
        body: JSON.stringify({
          backup_name: selectedBackup,
          namespace: selectedNamespace,
        }),
      });
  
      if (response.status === 401) {
        window.location.href = '/login'; // Redirect to login on auth failure
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete backup');
      }
  
      const data = await response.json();
      setMessage(data.message || `Backup "${selectedBackup}" deleted successfully!`);
      setBackups(backups.filter((b) => b.backup_name !== selectedBackup));
      setSelectedBackup('');
    } catch (error) {
      console.error('Error:', error.message);
      setMessage(`Failed to delete backup: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`delete-backup-container ${darkMode ? 'dark' : ''}`}>
      <img
        src={guardianLogo}
        alt="Guardian Logo"
        className="app-logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
      />
      <header className="page-header">
        <h1>Delete Backup</h1>
      </header>

      <div className="form-group">
        <label htmlFor="namespace-select">Select Namespace</label>
        <select
          id="namespace-select"
          value={selectedNamespace}
          onChange={handleNamespaceChange}
          disabled={isLoading}
        >
          <option value="">-- Select Namespace --</option>
          {namespaces.map((ns) => (
            <option key={ns.name} value={ns.name}>
              {ns.name}
            </option>
          ))}
        </select>
      </div>

      {selectedNamespace && (
        <div className="form-group">
          <label htmlFor="backup-select">Select Backup to Delete</label>
          <select
            id="backup-select"
            value={selectedBackup}
            onChange={(e) => {
              setSelectedBackup(e.target.value);
              setMessage('');
            }}
            disabled={isLoading}
          >
            <option value="">-- Select Backup --</option>
            {backups.map((backup) => (
              <option key={backup.backup_name} value={backup.backup_name}>
                {backup.backup_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleDeleteBackup}
        disabled={isLoading || !selectedNamespace || !selectedBackup}
      >
        {isLoading ? 'Deleting...' : 'Delete Backup'}
      </button>

      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}

      {isLoading && <div className="loader"></div>}
    </div>
  );
};

export default DeleteBackup;
