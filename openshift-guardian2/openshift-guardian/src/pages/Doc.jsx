import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import guardianLogo from './GUARDIAN.png';
import './osg-doc.css';

const Documentation = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') === 'true');

  useEffect(() => {
    localStorage.setItem('sidebarOpen', isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const navigateToSection = (section) => {
    setActiveSection(section);
    window.scrollTo(0, 0); // Reset scroll to top
    if (window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };

  const handleToggleDarkMode = () => {
    console.log('Toggling dark mode');
    toggleDarkMode();
  };

  return (
    <div className={`osg-documentation-container ${darkMode ? 'osg-dark' : ''}`}>
      {/* Header */}
      <header className="osg-doc-header">
        <div className="osg-header-content">
          <div className="osg-logo-container">
            <img src={guardianLogo} alt="Guardian Logo" className="osg-logo-img" />
            <h1 className="osg-logo-text">Openshift Guardian</h1>
          </div>
          <nav className="osg-desktop-nav">
            <a href="/doc" className="osg-nav-link osg-active">Documentation</a>
          </nav>
          <button className="osg-mobile-menu-button" onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="osg-mobile-menu">
          <div className="osg-mobile-menu-content">
            <a href="/doc" className="osg-mobile-nav-link osg-active">Documentation</a>
          </div>
        </div>
      )}

      {/* Documentation content */}
      <div className="osg-doc-content">
        {/* Sidebar */}
        <aside className={`osg-doc-sidebar ${isSidebarOpen ? 'osg-open' : ''}`}>
          <div className="osg-sidebar-sticky">
            <nav className="osg-sidebar-nav">
              <h3 className="osg-nav-category">Getting Started</h3>
              <a 
                href="#introduction" 
                onClick={() => navigateToSection('introduction')}
                className={`osg-nav-item ${activeSection === 'introduction' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Introduction
              </a>
              <a 
                href="#overview" 
                onClick={() => navigateToSection('overview')}
                className={`osg-nav-item ${activeSection === 'overview' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                OADP Overview
              </a>
              
              <h3 className="osg-nav-category">Backup Operations</h3>
              <a 
                href="#create-backup" 
                onClick={() => navigateToSection('create-backup')}
                className={`osg-nav-item ${activeSection === 'create-backup' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Creating Backups
              </a>
              <a 
                href="#view-backups" 
                onClick={() => navigateToSection('view-backups')}
                className={`osg-nav-item ${activeSection === 'view-backups' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Viewing Backups
              </a>
              <a 
                href="#schedule-backup" 
                onClick={() => navigateToSection('schedule-backup')}
                className={`osg-nav-item ${activeSection === 'schedule-backup' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Scheduling Backups
              </a>
              <a 
                href="#delete-backup" 
                onClick={() => navigateToSection('delete-backup')}
                className={`osg-nav-item ${activeSection === 'delete-backup' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Deleting Backups
              </a>
              <a 
                href="#delete-schedule" 
                onClick={() => navigateToSection('delete-schedule')}
                className={`osg-nav-item ${activeSection === 'delete-schedule' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Deleting Schedules
              </a>
              
              <h3 className="osg-nav-category">Restore Operations</h3>
              <a 
                href="#create-restore" 
                onClick={() => navigateToSection('create-restore')}
                className={`osg-nav-item ${activeSection === 'create-restore' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Creating Restores
              </a>
              <a 
                href="#view-restores" 
                onClick={() => navigateToSection('view-restores')}
                className={`osg-nav-item ${activeSection === 'view-restores' ? 'osg-active' : ''}`}
              >
                <ChevronRight size={16} className="osg-nav-icon" />
                Viewing Restores
              </a>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="osg-main-content">
          <div className="osg-content-card">
            {activeSection === 'introduction' && (
              <div className="osg-section">
                <div className="osg-section-header">
                  <img src={guardianLogo} alt="Guardian Logo" className="osg-section-icon" />
                  <h1 className="osg-section-title">Welcome to Openshift Guardian</h1>
                </div>
                
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Openshift Guardian provides a streamlined interface for managing backups and restores of your Openshift applications. Designed for developers and DevOps professionals, our tool simplifies data protection, ensuring your workloads are secure and recoverable with minimal effort. Whether you’re safeguarding critical data or preparing for disaster recovery, Openshift Guardian integrates with the Openshift API for Data Protection (OADP) to deliver reliable results.
                  </p>
                  
                  <div className="osg-info-box">
                    <h3 className="osg-info-title">About Openshift Guardian</h3>
                    <p className="osg-info-text">
                      Openshift Guardian is a user-friendly front-end for OADP, enabling you to create, manage, and restore backups of your Openshift namespaces. It supports manual and scheduled backups, selective restores, and detailed monitoring, all through an intuitive dashboard.
                    </p>
                  </div>
                  
                  <h2 className="osg-subsection-title">Core Features</h2>
                  
                  <div className="osg-features-grid">
                    <div className="osg-feature-card">
                      <span className="osg-feature-icon">📦</span>
                      <div>
                        <h3 className="osg-feature-title">Backup Management</h3>
                        <p className="osg-feature-text">Create and manage backups for specific namespaces, with a limit of three manual backups.</p>
                      </div>
                    </div>
                    <div className="osg-feature-card">
                      <span className="osg-feature-icon">🔄</span>
                      <div>
                        <h3 className="osg-feature-title">Restore Operations</h3>
                        <p className="osg-feature-text">Restore workloads to the same or a different namespace with customizable resource selection.</p>
                      </div>
                    </div>
                    <div className="osg-feature-card">
                      <span className="osg-feature-icon">⏰</span>
                      <div>
                        <h3 className="osg-feature-title">Scheduled Backups</h3>
                        <p className="osg-feature-text">Automate backups with schedules, retaining the last four backups.</p>
                      </div>
                    </div>
                    <div className="osg-feature-card">
                      <span className="osg-feature-icon">🗑️</span>
                      <div>
                        <h3 className="osg-feature-title">Resource Cleanup</h3>
                        <p className="osg-feature-text">Delete unneeded backups or schedules to optimize storage.</p>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Quick Navigation</h2>
                  <p>
                    Get started with these key tasks:
                  </p>
                  <ul className="osg-requirements-list">
                    <li><a href="#create-backup" onClick={() => navigateToSection('create-backup')} className="osg-text-link"><strong>Create a Backup</strong></a>: Protect your namespace data.</li>
                    <li><a href="#create-restore" onClick={() => navigateToSection('create-restore')} className="osg-text-link"><strong>Restore Data</strong></a>: Recover workloads from backups.</li>
                    <li><a href="#schedule-backup" onClick={() => navigateToSection('schedule-backup')} className="osg-text-link"><strong>Schedule Backups</strong></a>: Automate data protection.</li>
                    <li><a href="#overview" onClick={() => navigateToSection('overview')} className="osg-text-link"><strong>Learn About OADP</strong></a>: Understand the technology behind Guardian.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'overview' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Understanding OADP</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Openshift Guardian leverages the Openshift API for Data Protection (OADP) to provide robust backup and restore capabilities for your Openshift workloads.
                  </p>
                  
                  <div className="osg-gradient-box">
                    <h3 className="osg-gradient-title">What is OADP?</h3>
                    <p>
                      OADP, built on Velero, is an open-source framework for backing up, restoring, and migrating Kubernetes resources and persistent volumes. Integrated with Openshift, it ensures seamless data protection for your applications.
                    </p>
                  </div>
                  
                  <h2 className="osg-subsection-title">Key Concepts</h2>

                  <div className="osg-key-concepts">
                    <div className="osg-concept osg-blue">
                      <h3 className="osg-concept-title">Backup</h3>
                      <p className="osg-concept-text">A point-in-time snapshot of your namespace’s resources and data.</p>
                    </div>
                    <div className="osg-concept osg-green">
                      <h3 className="osg-concept-title">Restore</h3>
                      <p className="osg-concept-text">Recovers resources and data from a backup to a specified namespace.</p>
                    </div>
                    <div className="osg-concept osg-purple">
                      <h3 className="osg-concept-title">Backup Storage</h3>
                      <p className="osg-concept-text">A secure cloud storage location for storing backups.</p>
                    </div>
                    <div className="osg-concept osg-yellow">
                      <h3 className="osg-concept-title">Data Snapshots</h3>
                      <p className="osg-concept-text">Snapshots of Persistent Volume Claims (PVCs) for data recovery.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Architecture</h2>
                  <p>
                    Openshift Guardian interacts with OADP as follows:
                  </p>
                  
                  <div className="osg-architecture-diagram">
                    <div className="osg-diagram-item osg-blue">Openshift Guardian UI</div>
                    <div className="osg-diagram-arrow">↓</div>
                    <div className="osg-diagram-item osg-blue">Guardian API</div>
                    <div className="osg-diagram-arrow">↓</div>
                    <div className="osg-diagram-item osg-purple">OADP Operator</div>
                    <div className="osg-diagram-arrow">↓</div>
                    <div className="osg-diagram-item osg-green">Velero</div>
                    <div className="osg-diagram-arrow">↓</div>
                    <div className="osg-diagram-item osg-gray">Cloud Storage</div>
                  </div>

                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#create-backup" onClick={() => navigateToSection('create-backup')} className="osg-text-link"><strong>Creating Backups</strong></a>: Start protecting your data.</li>
                      <li><a href="#create-restore" onClick={() => navigateToSection('create-restore')} className="osg-text-link"><strong>Creating Restores</strong></a>: Learn to recover workloads.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'create-backup' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Creating Backups</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Create backups to safeguard your Openshift namespace’s resources, including configurations, deployments, and Persistent Volume Claims (PVCs). Backups are stored securely in a configured cloud storage backend.
                  </p>
                  
                  <div className="osg-backup-types-box">
                    <h3 className="osg-backup-types-title">Backup Scope</h3>
                    <ul className="osg-backup-types-list">
                      <li className="osg-backup-type">
                        <span className="osg-check-icon">✓</span>
                        <span><strong>Namespace Backup:</strong> Captures all resources within a selected namespace, including PVCs.</span>
                      </li>
                    </ul>
                    <p className="osg-backup-note">
                      <strong>Note:</strong> You can create up to three manual backups at a time. Additional backups will require deleting existing ones.
                    </p>
                  </div>
                  
                  <h2 className="osg-subsection-title">Steps to Create a Backup</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Navigate to Create Backup</h3>
                      <p className="osg-step-text">From the dashboard, select <strong>Backups  Create Backup</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Select Namespace</h3>
                      <p className="osg-step-text">Choose the target namespace from the dropdown list.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Initiate Backup</h3>
                      <p className="osg-step-text">Click <strong>Create Backup</strong> to start the process.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Considerations</h2>
                  <ul className="osg-requirements-list">
                    <li>Verify your authentication status (displayed as your email or username).</li>
                    <li>Backups are stored in the cloud via OADP.</li>
                    <li>Error messages will appear if the backup fails, with details to troubleshoot.</li>
                  </ul>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#view-backups" onClick={() => navigateToSection('view-backups')} className="osg-text-link"><strong>Viewing Backups</strong></a>: Monitor your backups.</li>
                      <li><a href="#schedule-backup" onClick={() => navigateToSection('schedule-backup')} className="osg-text-link"><strong>Scheduling Backups</strong></a>: Automate the process.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'view-backups' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Viewing Backups</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Monitor and manage your backups to ensure your data is protected and accessible for recovery.
                  </p>
                  
                  <h2 className="osg-subsection-title">Steps to View Backups</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Access View Backups</h3>
                      <p className="osg-step-text">Navigate to <strong>Backups  View Backups</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Select Namespace</h3>
                      <p className="osg-step-text">Choose a namespace to display its backups.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Review Details</h3>
                      <p className="osg-step-text">Filter by name and view details such as namespace, creation time, and status.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Backup Details</h2>
                  <div className="osg-table-container">
                    <table className="osg-options-table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="osg-option-name">Namespace</td>
                          <td className="osg-option-desc">The namespace associated with the backup.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Backup Name</td>
                          <td className="osg-option-desc">Unique identifier for the backup.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Creation Time</td>
                          <td className="osg-option-desc">When the backup was created.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Status</td>
                          <td className="osg-option-desc">Current state (e.g., Completed, Failed).</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#delete-backup" onClick={() => navigateToSection('delete-backup')} className="osg-text-link"><strong>Deleting Backups</strong></a>: Remove unneeded backups.</li>
                      <li><a href="#create-restore" onClick={() => navigateToSection('create-restore')} className="osg-text-link"><strong>Creating Restores</strong></a>: Recover from a backup.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'schedule-backup' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Scheduling Backups</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Automate backups for your namespaces to ensure consistent data protection without manual intervention.
                  </p>
                  
                  <div className="osg-backup-types-box">
                    <h3 className="osg-backup-types-title">Schedule Details</h3>
                    <p className="osg-backup-note">
                      <strong>Note:</strong> Scheduled backups retain only the last four backups per schedule. Older backups are automatically deleted to manage storage.
                    </p>
                  </div>
                  
                  <h2 className="osg-subsection-title">Steps to Schedule a Backup</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Navigate to Schedule Backup</h3>
                      <p className="osg-step-text">Select <strong>Backups  Schedule Backup</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Configure Schedule</h3>
                      <p className="osg-step-text">Select a namespace, frequency (1-10 days), and backup time (00:00-23:00).</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Save Schedule</h3>
                      <p className="osg-step-text">Click <strong>Create Scheduled Backup</strong> to activate the schedule.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Example</h2>
                  <p>
                    To schedule a backup for the <code>my-app</code> namespace every 3 days at 02:00:
                  </p>
                  <ul className="osg-requirements-list">
                    <li>Select <code>my-app</code> from the namespace dropdown.</li>
                    <li>Choose <strong>Every 3 days</strong> for frequency.</li>
                    <li>Set the time to <strong>02:00</strong>.</li>
                    <li>Click <strong>Create Scheduled Backup</strong>.</li>
                  </ul>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#delete-schedule" onClick={() => navigateToSection('delete-schedule')} className="osg-text-link"><strong>Deleting Schedules</strong></a>: Remove a schedule.</li>
                      <li><a href="#view-backups" onClick={() => navigateToSection('view-backups')} className="osg-text-link"><strong>Viewing Backups</strong></a>: Check scheduled backups.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'delete-backup' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Deleting Backups</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Remove unneeded backups to free up storage and maintain compliance with the three-backup limit for manual backups.
                  </p>
                  
                  <h2 className="osg-subsection-title">Steps to Delete a Backup</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Navigate to Delete Backup</h3>
                      <p className="osg-step-text">Select <strong>Backups  Delete Backup</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Select Namespace and Backup</h3>
                      <p className="osg-step-text">Choose a namespace and the backup to delete.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Delete Backup</h3>
                      <p className="osg-step-text">Click <strong>Delete Backup</strong> to remove it.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Considerations</h2>
                  <ul className="osg-requirements-list">
                    <li>Deleted backups are permanently removed and cannot be recovered.</li>
                    <li>Confirm the backup is no longer needed before deletion.</li>
                    <li>Success or error messages will confirm the outcome.</li>
                  </ul>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#create-backup" onClick={() => navigateToSection('create-backup')} className="osg-text-link"><strong>Creating Backups</strong></a>: Create a new backup.</li>
                      <li><a href="#delete-schedule" onClick={() => navigateToSection('delete-schedule')} className="osg-text-link"><strong>Deleting Schedules</strong></a>: Remove a schedule.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'delete-schedule' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Deleting Scheduled Backups</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Remove scheduled backup plans to stop automated backups when they are no longer required.
                  </p>
                  
                  <h2 className="osg-subsection-title">Steps to Delete a Schedule</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Navigate to Delete Schedule</h3>
                      <p className="osg-step-text">Select <strong>Backups  Delete Scheduled Backup</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Select Namespace and Schedule</h3>
                      <p className="osg-step-text">Choose a namespace and the schedule to remove.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Delete Schedule</h3>
                      <p className="osg-step-text">Click <strong>Delete Scheduled Backup</strong> to stop it.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Considerations</h2>
                  <ul className="osg-requirements-list">
                    <li>Deleting a schedule does not affect existing backups.</li>
                    <li>New schedules can be created as needed.</li>
                  </ul>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#schedule-backup" onClick={() => navigateToSection('schedule-backup')} className="osg-text-link"><strong>Scheduling Backups</strong></a>: Create a new schedule.</li>
                      <li><a href="#view-backups" onClick={() => navigateToSection('view-backups')} className="osg-text-link"><strong>Viewing Backups</strong></a>: Monitor backups.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'create-restore' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Creating Restores</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Restore workloads from a backup to recover data and configurations, either to the original namespace or a different destination namespace.
                  </p>
                  
                  <div className="osg-info-box">
                    <h3 className="osg-info-title">Understanding the Restore Process</h3>
                    <p className="osg-info-text">
                      Restoring a backup applies the saved resources and data to your Openshift cluster. Key considerations include:
                    </p>
                    <ul className="osg-requirements-list">
                      <li><strong>Included Data:</strong> Backups contain namespace resources (e.g., Deployments, ConfigMaps) and Persistent Volume Claims (PVCs) with their data.</li>
                      <li><strong>Overwriting Behavior:</strong> Existing resources in the destination namespace are overwritten with the backup’s versions, potentially replacing current configurations or data.</li>
                      <li><strong>PVC Handling:</strong> If a PVC exists in the destination namespace, it is typically skipped to preserve current data unless explicitly configured to overwrite, which replaces the existing PVC’s data with the backup’s snapshot.</li>
                      <li><strong>Preserved Data:</strong> Resources not included in the restore (e.g., via resource selection or match labels) remain unchanged.</li>
                      <li><strong>Recommendations:</strong> Verify the backup’s contents and test restores in a non-production namespace to avoid unintended data loss.</li>
                    </ul>
                  </div>
                  
                  <h2 className="osg-subsection-title">Steps to Create a Restore</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Navigate to Create Restore</h3>
                      <p className="osg-step-text">Select <strong>Restores  Create Restore</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Select Source Namespace and Backup</h3>
                      <p className="osg-step-text">Choose the source namespace and backup to restore from.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Select Destination Namespace</h3>
                      <p className="osg-step-text">Choose the namespace where the backup will be restored (same or different).</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">4. Specify Resources</h3>
                      <p className="osg-step-text">Select <strong>All Resources</strong> or specific resources (e.g., Deployments, PVCs).</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">5. Add Match Labels (Optional)</h3>
                      <p className="osg-step-text">Define key-value pairs to filter resources, then click <strong>Submit Label</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">6. Initiate Restore</h3>
                      <p className="osg-step-text">Click <strong>Create Restore</strong> to start the process.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Example</h2>
                  <p>
                    To restore only Deployments with the label <code>app=my-app</code> to a namespace <code>my-app-prod</code>:
                  </p>
                  <ul className="osg-requirements-list">
                    <li>Select the source namespace and backup.</li>
                    <li>Choose <code>my-app-prod</code> as the destination namespace.</li>
                    <li>Check <strong>Deployments</strong> under included resources.</li>
                    <li>Add a match label: Key: <code>app</code>, Value: <code>my-app</code>.</li>
                    <li>Click <strong>Create Restore</strong>.</li>
                  </ul>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#view-restores" onClick={() => navigateToSection('view-restores')} className="osg-text-link"><strong>Viewing Restores</strong></a>: Verify the restore.</li>
                      <li><a href="#create-backup" onClick={() => navigateToSection('create-backup')} className="osg-text-link"><strong>Creating Backups</strong></a>: Create a new backup.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'view-restores' && (
              <div className="osg-section">
                <h1 className="osg-section-title">Viewing Restores</h1>
                <div className="osg-section-content">
                  <p className="osg-section-intro">
                    Review restore operations to confirm successful recovery and inspect details like destination namespace and included resources.
                  </p>
                  
                  <div className="osg-info-box">
                    <h3 className="osg-info-title">Impact of Restores</h3>
                    <p className="osg-info-text">
                      Restores affect your cluster as follows:
                    </p>
                    <ul className="osg-requirements-list">
                      <li><strong>Restored Data:</strong> Includes namespace resources (e.g., Deployments, Services) and PVC data from snapshots.</li>
                      <li><strong>Overwriting:</strong> Existing resources in the destination namespace are overwritten, replacing current configurations or data with the backup’s versions.</li>
                      <li><strong>PVC Behavior:</strong> Existing PVCs are skipped by default to protect current data, unless overwritten, which replaces the PVC’s data with the backup’s snapshot.</li>
                      <li><strong>Unchanged Resources:</strong> Resources not included in the restore remain unaffected.</li>
                      <li><strong>Verification:</strong> Check restore details to ensure the correct resources were recovered. Contact support if issues arise.</li>
                    </ul>
                  </div>
                  
                  <h2 className="osg-subsection-title">Steps to View Restores</h2>
                  
                  <div className="osg-steps-container">
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">1. Navigate to View Restores</h3>
                      <p className="osg-step-text">Select <strong>Restores  View Restores</strong>.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">2. Select Namespace</h3>
                      <p className="osg-step-text">Choose a namespace to view its restore operations.</p>
                    </div>
                    <div className="osg-step-card">
                      <h3 className="osg-step-title">3. Inspect Details</h3>
                      <p className="osg-step-text">Click a restore to see details like destination namespace, included resources, and match labels.</p>
                    </div>
                  </div>
                  
                  <h2 className="osg-subsection-title">Restore Details</h2>
                  <div className="osg-table-container">
                    <table className="osg-options-table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="osg-option-name">Name</td>
                          <td className="osg-option-desc">Unique identifier for the restore.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Source Namespace</td>
                          <td className="osg-option-desc">The namespace of the backup.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Destination Namespace</td>
                          <td className="osg-option-desc">The namespace where resources were restored.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Status</td>
                          <td className="osg-option-desc">Current state (e.g., Completed, Failed).</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Creation Time</td>
                          <td className="osg-option-desc">When the restore was initiated.</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Included Resources</td>
                          <td className="osg-option-desc">Resources restored (e.g., Deployments, PVCs, or all).</td>
                        </tr>
                        <tr>
                          <td className="osg-option-name">Match Labels</td>
                          <td className="osg-option-desc">Labels used to filter restored resources.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="osg-next-steps">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="osg-requirements-list">
                      <li><a href="#create-restore" onClick={() => navigateToSection('create-restore')} className="osg-text-link"><strong>Creating Restores</strong></a>: Perform another restore.</li>
                      <li><a href="#view-backups" onClick={() => navigateToSection('view-backups')} className="osg-text-link"><strong>Viewing Backups</strong></a>: Check available backups.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="osg-doc-footer">
        <div className="osg-footer-content">
          <div className="osg-footer-logo">
            <img src={guardianLogo} alt="Guardian Logo" className="osg-footer-icon" />
            <span className="osg-footer-text">Openshift Guardian</span>
          </div>
          <div className="osg-footer-links">
            <a href="#" className="osg-footer-link">Terms</a>
            <a href="#" className="osg-footer-link">Privacy</a>
            <a href="#" className="osg-footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;