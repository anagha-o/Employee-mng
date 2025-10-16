import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import EmployeeDetails from './components/EmployeeDetails.tsx';
import './App.css';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  const [hash, setHash] = useState<string>(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (!currentUser) {
    return <Auth />;
  }

  // Routes: #/ => dashboard, #/employees/:id => details
  const match = hash.match(/^#\/(employees)\/([^\/]+)$/);
  if (match) {
    const id = decodeURIComponent(match[2]);
    return (
      <div className="app">
        <EmployeeDetails employeeId={id} />
      </div>
    );
  }

  return (
    <div className="app">
      <Dashboard />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App
