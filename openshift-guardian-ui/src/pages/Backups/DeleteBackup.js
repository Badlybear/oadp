import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteBackup.css';
import guardianLogo from '../GUARDIAN.png';

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
        const res = await fetch('http://localhost:8000/get-user-namespaces');
        const data = await res.json();
        setNamespaces(data.namespaces || []);
      } catch (error) {
        setMessage('Error fetching namespaces.');
      }
    };
    fetchNamespaces();
  }, []);

  const fetchBackupsByNamespace = async (namespace) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/get-backups?namespace=${namespace}`);
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (error) {
      setMessage('Error fetching backups.');
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
        body: JSON.stringify({
          backup_name: selectedBackup,
          namespace: selectedNamespace
        })
      });

      if (!response.ok) throw new Error('Failed to delete backup');
      setMessage(`Backup "${selectedBackup}" deleted successfully!`);
      setBackups(backups.filter((b) => b.backup_name !== selectedBackup));
      setSelectedBackup('');
    } catch (error) {
      setMessage('Failed to delete backup.');
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
