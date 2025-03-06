// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => (
  <div className="home-container">
    <header className="home-header">
      <h2>Welcome to Openshift Guardian</h2>
    </header>
    <main className="home-content">
      <p>Manage your backups and restores with ease.</p>
      <Link to="/login" className="btn">Client Login</Link>
    </main>
    <footer className="home-footer">
      <p>&copy; 2025 Openshift Guardian. All rights reserved.</p>
    </footer>
  </div>
);

export default Home;
