import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewRestores.css';
import guardianLogo from '../GUARDIAN.png';

const ViewRestores = ({ darkMode }) => {
  const [restores, setRestores] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [expandedRestore, setExpandedRestore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const res = await fetch('http://localhost:8000/get-user-namespaces', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch namespaces');
        const data = await res.json();
        setNamespaces(data.namespaces || []);
      } catch (error) {
        setError('Error fetching namespaces: ' + error.message);
      }
    };
    fetchNamespaces();
  }, []);

  useEffect(() => {
    const fetchRestores = async () => {
      if (!selectedNamespace) {
        setRestores([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8000/get-restores?namespace=${selectedNamespace}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch restores');
        const data = await res.json();
        setRestores(data.restores || []);
        setError('');
      } catch (error) {
        setError('Error fetching restores: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestores();
  }, [selectedNamespace]);

  const handleLogoClick = () => navigate('/dashboard');

  const toggleExpand = (id) => {
    setExpandedRestore(expandedRestore === id ? null : id);
  };

  const filteredRestores = restores.filter((restore) =>
    restore.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`view-restores-container ${darkMode ? 'dark' : ''}`}>
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
        <h1>View Restores</h1>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search restores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="namespace-select-restores">
        <label htmlFor="namespace-select">Select Namespace:</label>
        <select
          id="namespace-select"
          value={selectedNamespace}
          onChange={(e) => setSelectedNamespace(e.target.value)}
        >
          <option value="">-- Select Namespace --</option>
          {namespaces.map((ns) => (
            <option key={ns.name} value={ns.name}>
              {ns.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="loader"></div>
      ) : filteredRestores.length === 0 ? (
        <p>No restores found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="restores-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Namespace</th>
                <th>Status</th>
                <th>Time Created</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestores.map((restore, index) => (
                <React.Fragment key={index}>
                  <tr onClick={() => toggleExpand(index)} className="clickable-row">
                    <td>{restore.name}</td>
                    <td>{restore.namespace}</td>
                    <td className={`status ${restore.status?.toLowerCase() || ''}`}>
                      {restore.status || 'Unknown'}
                    </td>
                    <td>{restore['Time Created']}</td>
                    <td>{expandedRestore === index ? '▲' : '▼'}</td>
                  </tr>
                  {expandedRestore === index && (
                    <tr className="restore-details">
                      <td colSpan="5">
                        <strong>Included Resources:</strong>
                        <ul>
                          {restore.included_resources === '*' ? (
                            <li>All Resources</li>
                          ) : Array.isArray(restore.included_resources) ? (
                            restore.included_resources.map((res, idx) => <li key={idx}>{res}</li>)
                          ) : (
                            'None'
                          )}
                        </ul>
                        <br />
                        <strong>Match Labels:</strong>
                        <ul>
                          {restore.match_lables ? (
                            Object.entries(restore.match_lables).map(([key, value]) => (
                              <li key={key}>{key}: {value}</li>
                            ))
                          ) : (
                            'None'
                          )}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRestores;