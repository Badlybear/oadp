import React from 'react';
import './Splunk.css';

const Splunk = ({ darkMode }) => {
  return (
    <div className={`splunk-page-container ${darkMode ? 'splunk-dark' : ''}`}>
      <div className="splunk-content">
        <h1 className="splunk-page-title">Splunk Dashboard</h1>

        <div className="splunk-explanation">
          <ul>
            <li>Monitor your OpenShift backup and restore operations with ease.</li>
            <li>See errors for failed backups and restores to troubleshoot effectively.</li>
            <li>Access clear summaries of operation statuses and issues.</li>
            <li>Connect to your detailed analytics dashboard via the link below.</li>
          </ul>
        </div>

        <div className="splunk-link-section">
          <div className="splunk-link-card">
            <span className="splunk-link-placeholder">ADD LINK</span>
            <p>Your analytics dashboard link will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splunk;