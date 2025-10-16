import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      {currentUser ? <Dashboard /> : <Auth />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
