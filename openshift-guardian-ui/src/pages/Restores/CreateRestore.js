import React from 'react';
import './CreateRestore.css';

const CreateRestore = ({ darkMode }) => {
  return (
    <div className={`create-restore-container ${darkMode ? 'dark' : ''}`}>
      <h1>Create Restore</h1>
      <p>Placeholder for creating a restore.</p>
    </div>
  );
};

export default CreateRestore;