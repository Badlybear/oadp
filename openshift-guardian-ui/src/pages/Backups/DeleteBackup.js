// DeleteBackup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteBackup.css';
import guardianLogo from '../GUARDIAN.png';

const DeleteBackup = ({ darkMode }) => {
  const [selectedBackup, setSelectedBackup] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backups, setBackups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        setIsLoading(true);
        const mockBackups = [
          { id: 1, name: 'Backup_001' },
          { id: 2, name: 'Backup_002' },
          { id: 3, name: 'Backup_003' },
        ];
        setBackups(mockBackups);
      } catch (error) {
        setMessage('Error fetching backups.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackups();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleDeleteBackup = async () => {
    if (!selectedBackup) {
      setMessage('Please select a backup to delete.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage(`Backup "${selectedBackup}" deleted successfully!`);
      setBackups(backups.filter((b) => b.name !== selectedBackup));
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
        <label htmlFor="backup-select">Select Backup to Delete</label>
        <select
          id="backup-select"
          value={selectedBackup}
          onChange={(e) => { setSelectedBackup(e.target.value); setMessage(''); }}
          disabled={isLoading}
        >
          <option value="">--Select a backup--</option>
          {backups.map((backup) => (
            <option key={backup.id} value={backup.name}>{backup.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleDeleteBackup} disabled={isLoading || !selectedBackup}>
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