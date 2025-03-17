import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteBackup.css';
import guardianLogo from '../GUARDIAN.png';

const DeleteSchedule = ({ darkMode }) => {
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/get-scheduled-backups');
        const data = await response.json();
        
        // ✅ Ensure 'schedule_backups' contains valid data
        setSchedules(Array.isArray(data.schedule_backups) ? data.schedule_backups.filter(s => s.name) : []);
        
      } catch (error) {
        setMessage('Error fetching scheduled backups.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) {
      setMessage('Please select a scheduled backup to delete.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/delete-schedule-backup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_name: selectedSchedule }),
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
        <label htmlFor="schedule-select">Select Scheduled Backup to Delete</label>
        <select
          id="schedule-select"
          value={selectedSchedule}
          onChange={(e) => { setSelectedSchedule(e.target.value); setMessage(''); }}
          disabled={isLoading}
        >
          <option value="">--Select a scheduled backup--</option>
          {schedules.map((schedule) => (
            <option key={schedule.name} value={schedule.name}>{`${schedule.name} | Namespace: ${schedule.namespace} | Frequency: ${schedule.frequency} days | Time: ${schedule.amount}:00`}</option>
          ))}
        </select>
      </div>
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
