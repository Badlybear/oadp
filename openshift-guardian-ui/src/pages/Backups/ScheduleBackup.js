import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleBackup.css';
import guardianLogo from '../GUARDIAN.png';

const ScheduleBackup = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('');
  const [backupHour, setBackupHour] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [namespaces, setNamespaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/get-user-namespaces');
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

  const handleCreateScheduledBackup = async () => {
    if (!selectedNamespace || !frequencyDays || backupHour === '') {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/create-schedule-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namespaces: selectedNamespace, schedule: frequencyDays, amount: backupHour }),
      });
      if (!response.ok) throw new Error('Failed to create scheduled backup');
      setMessage(`Scheduled backup created successfully! Backup will run every ${frequencyDays} day(s) at ${backupHour}:00.`);
      setSelectedNamespace('');
      setFrequencyDays('');
      setBackupHour('');
    } catch (error) {
      setMessage(error.message || 'Failed to create scheduled backup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`schedule-backup-container ${darkMode ? 'dark' : ''}`}>
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
        <h1>Create Scheduled Backup</h1>
      </header>
      <div className="form-group">
        <label htmlFor="namespace-select">Choose a namespace:</label>
        <select
          id="namespace-select"
          value={selectedNamespace}
          onChange={(e) => { setSelectedNamespace(e.target.value); setMessage(''); }}
          disabled={isLoading}
        >
          <option value="">--Select a namespace--</option>
          {namespaces.map((namespace) => (
            <option key={namespace.name} value={namespace.name}>{namespace.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="frequency-select">Backup Frequency (days):</label>
        <select
          id="frequency-select"
          value={frequencyDays}
          onChange={(e) => { setFrequencyDays(e.target.value); setMessage(''); }}
          disabled={isLoading}
        >
          <option value="">--Select frequency--</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>Every {day} day{day > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="hour-select">Backup Hour (24h):</label>
        <select
          id="hour-select"
          value={backupHour}
          onChange={(e) => { setBackupHour(e.target.value); setMessage(''); }}
          disabled={isLoading}
        >
          <option value="">--Select hour--</option>
          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
            <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateScheduledBackup} disabled={isLoading || !selectedNamespace || !frequencyDays || backupHour === ''}>
        {isLoading ? 'Scheduling...' : 'Create Scheduled Backup'}
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

export default ScheduleBackup;
