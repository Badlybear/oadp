import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewRestores.css';
import guardianLogo from '../GUARDIAN.png';

const ViewRestores = ({ darkMode }) => {
  const [restores, setRestores] = useState([]);
  const [expandedRestore, setExpandedRestore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestores = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/get-restores');
        const data = await response.json();
        setRestores(data.restores || []);
      } catch (error) {
        console.error('Error fetching restores:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestores();
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const toggleExpand = (id) => {
    setExpandedRestore(expandedRestore === id ? null : id);
  };

  const filteredRestores = restores.filter(restore =>
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

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search restores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : filteredRestores.length === 0 ? (
        <p>No restores found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="restores-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Time Created</th>
                <th>Status</th>
                <th>Namespace</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestores.map((restore, index) => (
                <React.Fragment key={index}>
                  <tr onClick={() => toggleExpand(index)} className="clickable-row">
                    <td>{restore.name}</td>
                    <td>{restore["Time Created"]}</td>
                    <td className={`status ${restore.status ? restore.status.toLowerCase() : ''}`}>
                      {restore.status || 'Unknown'}
                    </td>
                    <td>{restore.namespace}</td>
                    <td>{expandedRestore === index ? '▲' : '▼'}</td>
                  </tr>
                  {expandedRestore === index && (
                    <tr className="restore-details">
                      <td colSpan="5">
                        <strong>Included Resources:</strong>
                        <ul>
                          {restore.included_resources === '*'
                            ? <li>All Resources</li>
                            : Array.isArray(restore.included_resources)
                              ? restore.included_resources.map((res, idx) => <li key={idx}>{res}</li>)
                              : 'None'}
                        </ul>
                        <br />
                        <strong>Match Labels:</strong>
                        <ul>
                          {restore.match_lables
                            ? Object.entries(restore.match_lables).map(([key, value]) => (
                                <li key={key}>{key}: {value}</li>
                              ))
                            : 'None'}
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
