import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import AuthPage from './components/AuthPage';
import { initDatabase } from './services/api';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on first load
    initDatabase().then(() => setDbInitialized(true));
  }, []);

  if (isLoading || !dbInitialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Always Demon...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-950">
        <Header 
          onAdminClick={() => setShowAdmin(!showAdmin)} 
          showAdmin={showAdmin} 
        />
        {showAdmin && user?.isAdmin ? <AdminPanel /> : <HomePage />}
      </div>
    </AppProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
