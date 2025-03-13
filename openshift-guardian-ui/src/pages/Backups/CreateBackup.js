// CreateBackup.jsx (unchanged)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBackup.css';
import guardianLogo from '../GUARDIAN.png';

const CreateBackup = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [namespaces, setNamespaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        const fetchedNamespaces = [
          { id: 1, name: 'Namespace 1' },
          { id: 2, name: 'Namespace 2' },
          { id: 3, name: 'Namespace 3' },
        ];
        setNamespaces(fetchedNamespaces);
      } catch (error) {
        setMessage('Error fetching namespaces.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNamespaces();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleNamespaceChange = (e) => {
    setSelectedNamespace(e.target.value);
    setMessage('');
  };

  const handleCreateBackup = async () => {
    if (!selectedNamespace) {
      setMessage('Please select a namespace.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Backup created successfully!');
      setSelectedNamespace('');
    } catch (error) {
      setMessage('Failed to create backup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`create-backup-container ${darkMode ? 'dark' : ''}`}>
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
        <h1>Create Backup</h1>
      </header>
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
      <button onClick={handleCreateBackup} disabled={isLoading || !selectedNamespace}>
        {isLoading ? 'Creating...' : 'Create Backup'}
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

export default CreateBackup;