import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { isAdmin, setIsAdmin } = useApp();
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLoginModal(false);
    setCurrentPage('admin');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onAdminClick={handleAdminClick} 
        currentPage={currentPage} 
        onHomeClick={handleHomeClick}
      />

      {currentPage === 'home' && <HomePage />}
      
      {currentPage === 'admin' && isAdmin && (
        <div>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          <AdminPanel />
        </div>
      )}

      {showLoginModal && (
        <AdminLogin 
          onLogin={handleLogin} 
          onCancel={() => setShowLoginModal(false)} 
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
