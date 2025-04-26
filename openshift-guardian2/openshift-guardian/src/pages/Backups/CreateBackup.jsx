import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBackup.css';
import guardianLogo from '../GUARDIAN.png';
import { verifyAuth } from '../../auth/useAuth.jsx';

const CreateBackup = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [namespaces, setNamespaces] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        const currentUser = await verifyAuth(); // Redirects to login if unauthenticated
        setUser(currentUser);
        const response = await fetch('http://localhost:8000/get-user-namespaces', {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Failed to fetch namespaces');
        const data = await response.json();
        setNamespaces(data.namespaces || []);
      } catch (error) {
        setMessage('Error fetching namespaces: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNamespaces();
  }, []);

  const handleLogoClick = () => navigate('/dashboard');

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
      await verifyAuth(); // Redirects to login if unauthenticated
      const response = await fetch('http://localhost:8000/create-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ namespaces: selectedNamespace }),
      });
      if (!response.ok) throw new Error('Failed to create backup');
      setMessage('Backup created successfully!');
      setSelectedNamespace('');
    } catch (error) {
      setMessage('Failed to create backup: ' + error.message);
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
          {namespaces.map((ns) => (
            <option key={ns.name} value={ns.name}>{ns.name}</option>
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