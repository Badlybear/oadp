// src/pages/ClientLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientLogin.css';

const ClientLogin = () => {
  // Added state variable to flag when to trigger fade-out transition.
  const [transition, setTransition] = useState(false);
  const navigate = useNavigate();

  const handleSSOLogin = async () => {
    // Simulate an SSO login delay (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const simulatedResponse = { data: { success: true, token: 'dummy_token' } };
    if (simulatedResponse.data.success) {
      localStorage.setItem('authToken', simulatedResponse.data.token);
      // Trigger fade-out transition
      setTransition(true);
      // Delay navigation by 500ms to allow the fade-out animation, and pass state so Dashboard can know it came from Login
      setTimeout(() => {
        navigate('/dashboard', { state: { fromLogin: true } });
      }, 500);
    } else {
      alert('SSO login failed, please try again.');
    }
  };

  return (
    // The container gets "page-transition" and conditionally "fade-out" when transition state is true.
    <div className={`login-container page-transition ${transition ? 'fade-out' : ''}`}>
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
