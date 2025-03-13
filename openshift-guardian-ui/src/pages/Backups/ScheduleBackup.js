import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleBackup.css';
import guardianLogo from '../GUARDIAN.png';

const ScheduleBackup = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('');
  const [backupHour, setBackupHour] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const namespaces = [
    { id: 1, name: 'Namespace 1' },
    { id: 2, name: 'Namespace 2' },
    { id: 3, name: 'Namespace 3' },
  ];
  const daysOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i);

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      if (success) {
        setMessage(`Scheduled backup created successfully! Backup will run every ${frequencyDays} day(s) at ${backupHour}:00.`);
        setSelectedNamespace('');
        setFrequencyDays('');
        setBackupHour('');
      } else {
        throw new Error('Failed to create scheduled backup.');
      }
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
            <option key={namespace.id} value={namespace.name}>{namespace.name}</option>
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
          {daysOptions.map((day) => (
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
          {hoursOptions.map((hour) => (
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