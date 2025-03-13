import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRestore.css';
import guardianLogo from '../GUARDIAN.png';

const CreateRestore = ({ darkMode }) => {
  const [selectedBackup, setSelectedBackup] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [includedResources, setIncludedResources] = useState({
    allNamespaceResources: false,
    deployments: false,
    deploymentconfigs: false,
    statefulsets: false,
    replicasets: false,
    daemonsets: false,
    cronjobs: false,
    configmaps: false,
    secrets: false,
    serviceaccounts: false,
    services: false,
    ingresses: false,
    networkpolicies: false,
    persistentvolumeclaims: false,
    persistentvolumes: false,
    volumesnapshots: false,
    rolebinding: false,
    roles: false,
    routes: false,
    buildconfigs: false,
  });
  const [matchLabels, setMatchLabels] = useState([{ key: '', value: '' }]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backups, setBackups] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedBackups = [
          { id: 1, name: 'Backup_001' },
          { id: 2, name: 'Backup_002' },
          { id: 3, name: 'Backup_003' },
        ];
        const fetchedNamespaces = [
          { id: 1, name: 'Namespace 1' },
          { id: 2, name: 'Namespace 2' },
          { id: 3, name: 'Namespace 3' },
        ];
        setBackups(fetchedBackups);
        setNamespaces(fetchedNamespaces);
      } catch (error) {
        setMessage('Failed to load backups or namespaces.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogoClick = () => navigate('/dashboard');

  const handleBackupChange = (e) => {
    setSelectedBackup(e.target.value);
    setMessage('');
  };

  const handleNamespaceChange = (e) => {
    setSelectedNamespace(e.target.value);
    setMessage('');
  };

  const handleResourceChange = (resource) => {
    if (resource === 'allNamespaceResources') {
      const allSelected = !includedResources.allNamespaceResources;
      setIncludedResources(
        Object.fromEntries(
          Object.keys(includedResources).map(key => [key, allSelected])
        )
      );
    } else {
      setIncludedResources(prev => ({
        ...prev,
        [resource]: !prev[resource],
        allNamespaceResources: false, // Uncheck "All" if individual items are toggled
      }));
    }
  };

  const handleLabelChange = (index, field, value) => {
    const newLabels = [...matchLabels];
    newLabels[index][field] = value;
    setMatchLabels(newLabels);
  };

  const addLabelPair = () => {
    setMatchLabels([...matchLabels, { key: '', value: '' }]);
  };

  const handleCreateRestore = async () => {
    if (!selectedBackup || !selectedNamespace) {
      setMessage('Please select both a backup and a namespace.');
      return;
    }

    const selectedResources = Object.entries(includedResources)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedResources.length === 0) {
      setMessage('Please select at least one resource to include.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(`Restore created successfully from ${selectedBackup} to ${selectedNamespace} with ${selectedResources.length} resources!`);
      handleReset();
    } catch (error) {
      setMessage('Failed to create restore. Please try again.');
      console.error('Error creating restore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedBackup('');
    setSelectedNamespace('');
    setIncludedResources(Object.fromEntries(
      Object.keys(includedResources).map(key => [key, false])
    ));
    setMatchLabels([{ key: '', value: '' }]);
    setMessage('');
  };

  return (
    <div className={`create-restore-container ${darkMode ? 'dark' : ''}`}>
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
        <h1>Create Restore</h1>
      </header>

      <div className="form-group">
        <label htmlFor="backup-select">Select Backup</label>
        <select
          id="backup-select"
          value={selectedBackup}
          onChange={handleBackupChange}
          disabled={isLoading}
        >
          <option value="">--Select a backup--</option>
          {backups.map((backup) => (
            <option key={backup.id} value={backup.name}>
              {backup.name}
            </option>
          ))}
        </select>
      </div>

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

      <div className="resources-group">
        <label>Included Resources</label>
        <div className="resource-checkbox">
          <input
            type="checkbox"
            id="allNamespaceResources"
            checked={includedResources.allNamespaceResources}
            onChange={() => handleResourceChange('allNamespaceResources')}
            disabled={isLoading}
          />
          <label htmlFor="allNamespaceResources">All Namespace Resources</label>
        </div>
        {Object.keys(includedResources)
          .filter(key => key !== 'allNamespaceResources')
          .map(resource => (
            <div key={resource} className="resource-checkbox">
              <input
                type="checkbox"
                id={resource}
                checked={includedResources[resource]}
                onChange={() => handleResourceChange(resource)}
                disabled={isLoading}
              />
              <label htmlFor={resource}>{resource}</label>
            </div>
          ))}
      </div>

      <div className="match-labels-group">
        <label>Match Labels</label>
        {matchLabels.map((label, index) => (
          <div key={index} className="label-pair">
            <input
              type="text"
              placeholder="Key"
              value={label.key}
              onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Value"
              value={label.value}
              onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
              disabled={isLoading}
            />
          </div>
        ))}
        <button className="add-label-btn" onClick={addLabelPair} disabled={isLoading}>
          Add Label
        </button>
      </div>

      <div className="button-group">
        <button
          onClick={handleCreateRestore}
          disabled={isLoading || !selectedBackup || !selectedNamespace}
        >
          {isLoading ? 'Creating...' : 'Create Restore'}
        </button>
        <button onClick={handleReset} disabled={isLoading}>
          Reset
        </button>
      </div>

      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {isLoading && <div className="loader"></div>}
    </div>
  );
};

export default CreateRestore;