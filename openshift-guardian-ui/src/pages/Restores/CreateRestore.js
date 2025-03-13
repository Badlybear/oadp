import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRestore.css';
import guardianLogo from '../GUARDIAN.png'; // Adjust path as needed

const CreateRestore = ({ darkMode }) => {
  const [selectedBackup, setSelectedBackup] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backups, setBackups] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedBackups = [
          { id: 1, name: 'Backup_001' },
          { id: 2, name: 'Backup_002' },
          { id: 3, name: 'Backup_003' },
        ];
        const fetchedNamespaces = [
          { id: 1, name: 'Namespace 1' },
          { id: 2, name: 'Namespace 2' },
          { id: 3, name: 'Namespace 3' },
        ];
        setBackups(fetchedBackups);
        setNamespaces(fetchedNamespaces);
      } catch (error) {
        setMessage('Failed to load backups or namespaces.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleBackupChange = (e) => {
    setSelectedBackup(e.target.value);
    setMessage('');
  };

  const handleNamespaceChange = (e) => {
    setSelectedNamespace(e.target.value);
    setMessage('');
  };

  const handleCreateRestore = async () => {
    if (!selectedBackup || !selectedNamespace) {
      setMessage('Please select both a backup and a namespace.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(`Restore created successfully from ${selectedBackup} to ${selectedNamespace}!`);
      setSelectedBackup('');
      setSelectedNamespace('');
    } catch (error) {
      setMessage('Failed to create restore. Please try again.');
      console.error('Error creating restore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedBackup('');
    setSelectedNamespace('');
    setMessage('');
  };

  return (
    <div className={`create-restore-container ${darkMode ? 'dark' : ''}`}>
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
        <h1>Create Restore</h1>
      </header>
      <div className="form-group">
        <label htmlFor="backup-select">Select Backup</label>
        <select
          id="backup-select"
          value={selectedBackup}
          onChange={handleBackupChange}
          disabled={isLoading}
        >
          <option value="">--Select a backup--</option>
          {backups.map((backup) => (
            <option key={backup.id} value={backup.name}>
              {backup.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="namespace-select">Select Namespace</label>
        <select
          id="namespace-select"
          value={selectedNamespace}
          onChange={handleNamespaceChange}
          disabled={isLoading}
        >
          <option value="">--Select a namespace--</option>
          {namespaces.map((namespace) => (
            <option key={namespace.id} value={namespace.name}>
              {namespace.name}
            </option>
          ))}
        </select>
      </div>
      <div className="button-group">
        <button
          onClick={handleCreateRestore}
          disabled={isLoading || !selectedBackup || !selectedNamespace}
        >
          {isLoading ? 'Creating...' : 'Create Restore'}
        </button>
        <button onClick={handleReset} disabled={isLoading}>
          Reset
        </button>
      </div>
      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {isLoading && <div className="loader"></div>}
    </div>
  );
};

export default CreateRestore;