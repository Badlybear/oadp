import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteBackup.css';
import guardianLogo from '../GUARDIAN.png';

const DeleteSchedule = ({ darkMode }) => {
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [namespaces, setNamespaces] = useState([]);
  const [schedules, setSchedules] = useState([]);
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

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedNamespace) {
        setSchedules([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8000/get-scheduled-backups?namespace=${selectedNamespace}`);
        const data = await res.json();
        setSchedules(data.schedule_backups || []);
      } catch (error) {
        setMessage('Error fetching scheduled backups.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedNamespace]);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleDeleteSchedule = async () => {
    if (!selectedNamespace || !selectedSchedule) {
      setMessage('Please select a namespace and scheduled backup.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/delete-schedule-backup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_name: selectedSchedule,
          namespace: selectedNamespace
        })
      });
      if (!response.ok) throw new Error('Failed to delete scheduled backup');

      setMessage(`Scheduled backup "${selectedSchedule}" deleted successfully!`);
      setSchedules(schedules.filter((s) => s.name !== selectedSchedule));
      setSelectedSchedule('');
    } catch (error) {
      setMessage('Failed to delete scheduled backup.');
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
        <h1>Delete Scheduled Backup</h1>
      </header>

      <div className="form-group">
        <label htmlFor="namespace-select">Select Namespace</label>
        <select
          id="namespace-select"
          value={selectedNamespace}
          onChange={(e) => {
            setSelectedNamespace(e.target.value);
            setMessage('');
            setSelectedSchedule('');
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

      {selectedNamespace && (
        <div className="form-group">
          <label htmlFor="schedule-select">Select Scheduled Backup</label>
          <select
            id="schedule-select"
            value={selectedSchedule}
            onChange={(e) => {
              setSelectedSchedule(e.target.value);
              setMessage('');
            }}
            disabled={isLoading}
          >
            <option value="">-- Select Scheduled Backup --</option>
            {schedules.map((schedule) => (
              <option key={schedule.name} value={schedule.name}>
                {`${schedule.name} | ${schedule.frequency} days @ ${schedule.amount}:00`}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleDeleteSchedule} disabled={isLoading || !selectedSchedule}>
        {isLoading ? 'Deleting...' : 'Delete Scheduled Backup'}
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

export default DeleteSchedule;
