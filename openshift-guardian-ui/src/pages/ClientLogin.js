// ClientLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import guardianLogo from './GUARDIAN.png';
import './ClientLogin.css';

const ClientLogin = () => {
  const [transition, setTransition] = useState(false);
  const navigate = useNavigate();

  const handleSSOLogin = async () => {
    // Start the fade-out animation
    setTransition(true);
    
    // Simulate a login request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const simulatedResponse = { data: { success: true, token: 'dummy_token' } };
    
    if (simulatedResponse.data.success) {
      localStorage.setItem('authToken', simulatedResponse.data.token);
      // Navigate after fade animation completes (500ms)
      setTimeout(() => {
        navigate('/dashboard', { state: { fromLogin: true } });
      }, 500);
    } else {
      setTransition(false); // reset if login fails
      alert('SSO login failed, please try again.');
    }
  };

  return (
    <div className={`login-container ${transition ? 'fade-out' : ''}`}>
      <div className="login-card">
        <img src={guardianLogo} alt="Guardian Logo" className="login-logo" />
        <h2>Welcome to Openshift Guardian</h2>
        <p>
          Protect your backups, enable rapid restores, and let our Guardian keep your information secure.
        </p>
        <button onClick={handleSSOLogin} className="btn">Login with SSO</button>
        <div className="extra-text">
          <p>By logging in, you agree to our terms and privacy policy.</p>
          <p>&copy; 2025 Openshift Guardian</p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
