import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBackup.css';
import guardianLogo from '../GUARDIAN.png';
import { verifyAuth } from '../../auth/useAuth.jsx'; // ✅ ייבוא פונקציית האימות

const CreateBackup = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [namespaces, setNamespaces] = useState([]);
  const [user, setUser] = useState(null); // ✅ נשתמש בזה לשם המשתמש
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        const currentUser = await verifyAuth(); // 🔒 בדיקת התחברות
        setUser(currentUser); // ✅ שמור את המשתמש להצגה
        const response = await fetch('http://localhost:8000/get-user-namespaces', {
          credentials: "include",
        });
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
      await verifyAuth(); // 🔒 בדיקה גם לפני יצירת גיבוי
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
        {user && (
          <p style={{ fontSize: "14px", marginTop: "-10px" }}>
            👤 Connected as: <strong>{user.name || user.email}</strong>
          </p>
        )}
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
