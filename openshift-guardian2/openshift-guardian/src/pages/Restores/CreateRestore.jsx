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
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // New state for popup
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const res = await fetch('http://localhost:8000/get-user-namespaces', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load namespaces');
        const data = await res.json();
        setNamespaces(data.namespaces || []);
      } catch (error) {
        setMessage('Failed to load namespaces: ' + error.message);
      }
    };
    fetchNamespaces();
  }, []);

  useEffect(() => {
    const fetchBackups = async () => {
      if (!selectedNamespace) {
        setBackups([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8000/get-backups?namespace=${selectedNamespace}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load backups');
        const data = await res.json();
        setBackups(data.backups || []);
      } catch (error) {
        setMessage('Failed to load backups: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackups();
  }, [selectedNamespace]);

  const handleLogoClick = () => navigate('/dashboard');

  const handleResourceChange = (resource) => {
    if (resource === 'allNamespaceResources') {
      const allSelected = !includedResources.allNamespaceResources;
      setIncludedResources(
        Object.fromEntries(Object.keys(includedResources).map((key) => [key, allSelected]))
      );
    } else {
      setIncludedResources((prev) => ({
        ...prev,
        [resource]: !prev[resource],
        allNamespaceResources: false,
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

  const getRestoreSummary = () => {
    const selectedResources = includedResources.allNamespaceResources
      ? '*'
      : Object.entries(includedResources)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(', ') || 'None';
    const matchLabelsObj = matchLabels
      .filter(({ key, value }) => key && value)
      .map(({ key, value }) => `${key}: ${value}`)
      .join(', ') || 'None';

    return {
      namespace: selectedNamespace,
      backup: selectedBackup,
      resources: selectedResources,
      labels: matchLabelsObj,
    };
  };

  const handleCreateRestore = () => {
    if (!selectedBackup || !selectedNamespace) {
      setMessage('Please select both a backup and a namespace.');
      return;
    }
    setShowConfirmPopup(true); // Show popup instead of creating immediately
  };

  const confirmCreateRestore = async () => {
    const selectedResources = includedResources.allNamespaceResources
      ? '*'
      : Object.entries(includedResources)
          .filter(([_, value]) => value)
          .map(([key]) => key);

    const matchLabelsObj = matchLabels.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    setIsLoading(true);
    setShowConfirmPopup(false); // Hide popup
    try {
      const response = await fetch('http://localhost:8000/create-restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          namespaces: selectedNamespace,
          backup_name: selectedBackup,
          included_resources: selectedResources,
          match_lables: matchLabelsObj,
        }),
      });
      if (!response.ok) throw new Error('Failed to create restore');
      setMessage('Restore created successfully!');
    } catch (error) {
      setMessage('Failed to create restore: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelCreateRestore = () => {
    setShowConfirmPopup(false); // Just close the popup
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

      {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}

      <div className="form-group">
        <label>Select Namespace</label>
        <select value={selectedNamespace} onChange={(e) => setSelectedNamespace(e.target.value)}>
          <option value="">--Select a namespace--</option>
          {namespaces.map((ns) => (
            <option key={ns.name} value={ns.name}>{ns.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Backup</label>
        <select value={selectedBackup} onChange={(e) => setSelectedBackup(e.target.value)}>
          <option value="">--Select a backup--</option>
          {backups.map((b) => (
            <option key={b.backup_name} value={b.backup_name}>{`${b.backup_name} | Namespace: ${b["namespace"]}`}</option>
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
          />
          <label htmlFor="allNamespaceResources">All Namespace Resources</label>
        </div>
        {Object.keys(includedResources)
          .filter((key) => key !== 'allNamespaceResources')
          .map((resource) => (
            <div key={resource} className="resource-checkbox">
              <input
                type="checkbox"
                id={resource}
                checked={includedResources[resource]}
                onChange={() => handleResourceChange(resource)}
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
            />
            <input
              type="text"
              placeholder="Value"
              value={label.value}
              onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
            />
          </div>
        ))}
        <button className="add-label-btn" onClick={addLabelPair} title="Click to add labels">
          Add Label ➕
        </button>
      </div>

      <button onClick={handleCreateRestore} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Restore'}
      </button>

      {showConfirmPopup && (
        <div className="confirm-popup-overlay">
          <div className={`confirm-popup ${darkMode ? 'dark' : ''}`}>
            <h2>Restore Summary</h2>
            <div className="summary-content">
              <p><strong>Namespace:</strong> {getRestoreSummary().namespace}</p>
              <p><strong>Backup:</strong> {getRestoreSummary().backup}</p>
              <p><strong>Included Resources:</strong> {getRestoreSummary().resources}</p>
              <p><strong>Match Labels:</strong> {getRestoreSummary().labels}</p>
            </div>
            <p className="confirm-question">Are you sure you want to create this restore?</p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={confirmCreateRestore}>
                Yes
              </button>
              <button className="confirm-no" onClick={cancelCreateRestore}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRestore;