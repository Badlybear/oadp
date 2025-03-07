// src/pages/ClientLogin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientLogin.css';

const ClientLogin = () => {
  const navigate = useNavigate();

  const handleSSOLogin = async () => {
    // Simulate an SSO login delay (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const simulatedResponse = { data: { success: true, token: 'dummy_token' } };
    if (simulatedResponse.data.success) {
      localStorage.setItem('authToken', simulatedResponse.data.token);
      navigate('/dashboard');
    } else {
      alert('SSO login failed, please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Openshift Guardian</h2>
        <p>
          Welcome to the Guardian portal—your data shield. Protect your backups,
          enable rapid restores, and let our Guardian keep your information secure.
        </p>
        <button onClick={handleSSOLogin} className="btn">Login with SSO</button>
        <div className="extra-text">
          <p>By logging in, you agree to our terms and privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
