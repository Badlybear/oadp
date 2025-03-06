// src/pages/ClientLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientLogin.css'; // Correct import

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    // Demo credentials for clients
    if (email === 'client@openshiftguardian.com' && password === 'password') {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Client Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;
