import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmployeeManager from './EmployeeManager';
import { LogOut, User } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Employee Management System</h1>
              <p className="text-sm text-muted-foreground">Manage your team efficiently</p>
            </div>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'User')}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </header>
      <main className="py-6">
        <EmployeeManager />
      </main>
    </div>
  );
};

export default Dashboard;
