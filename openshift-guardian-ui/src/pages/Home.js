// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Openshift Guardian</h1>
      </header>
      <main className="home-content">
        <p>Welcome to Openshift Guardian. Please login to access staff features.</p>
        <Link to="/login" className="btn">Staff Login</Link>
      </main>
      <footer className="home-footer">
        <p>&copy; 2025 Openshift Guardian. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
