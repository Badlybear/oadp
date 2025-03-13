import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteScheduleResource.css';
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
        const mockResources = [
          { id: 1, name: 'Schedule_001' },
          { id: 2, name: 'Schedule_002' },
          { id: 3, name: 'Schedule_003' },
        ];
        setResources(mockResources);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      if (success) {
        setMessage(`Scheduled resource "${selectedResource}" deleted successfully!`);
        setResources(resources.filter((r) => r.name !== selectedResource));
        setSelectedResource('');
      } else {
        throw new Error('Failed to delete scheduled resource.');
      }
    } catch (error) {
      setMessage(error.message || 'Failed to delete scheduled resource.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`delete-schedule-container ${darkMode ? 'dark' : ''}`}>
      <header className="page-header">
        <img
          src={guardianLogo}
          alt="Guardian Logo"
          className="guardian-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
        />
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
            <option key={resource.id} value={resource.name}>{resource.name}</option>
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