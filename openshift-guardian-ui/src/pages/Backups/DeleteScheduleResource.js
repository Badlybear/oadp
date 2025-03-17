import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteBackup.css';
import guardianLogo from '../GUARDIAN.png';

const DeleteScheduleResource = ({ darkMode }) => {
  const [selectedResource, setSelectedResource] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/get-scheduled-backups');
        const data = await response.json();
        setResources(data.backups);
      } catch (error) {
        setMessage('Error fetching scheduled resources.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleDeleteResource = async () => {
    if (!selectedResource) {
      setMessage('Please select a scheduled resource to delete.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/delete-schedule-backup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_name: selectedResource }),
      });
      if (!response.ok) throw new Error('Failed to delete scheduled resource');
      setMessage(`Scheduled resource "${selectedResource}" deleted successfully!`);
      setResources(resources.filter((r) => r.name !== selectedResource));
      setSelectedResource('');
    } catch (error) {
      setMessage(error.message || 'Failed to delete scheduled resource.');
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
        <h1>Delete Scheduled Resource</h1>
      </header>
      <div className="form-group">
        <label htmlFor="resource-select">Choose a scheduled resource:</label>
        <select
          id="resource-select"
          value={selectedResource}
          onChange={(e) => { setSelectedResource(e.target.value); setMessage(''); }}
          disabled={isLoading}
        >
          <option value="">--Select a resource--</option>
          {resources.map((resource) => (
            <option key={resource.name} value={resource.name}>{resource.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleDeleteResource} disabled={isLoading || !selectedResource}>
        {isLoading ? 'Deleting...' : 'Delete Scheduled Resource'}
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

export default DeleteScheduleResource;
