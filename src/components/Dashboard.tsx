import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import EmployeeManager from './EmployeeManager';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Employee Management System</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <EmployeeManager />
      </main>
    </div>
  );
};

export default Dashboard;
