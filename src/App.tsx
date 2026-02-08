import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AuthPage } from './pages/AuthPage';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AdminPanel } from './components/AdminPanel';

function MainApp() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/50 animate-pulse">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ALWAYS DEMON</h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => {}} />;
  }

  // Main app
  return (
    <AppProvider>
      <div className="min-h-screen bg-black">
        <Header 
          currentPage={currentPage}
          onHomeClick={() => setCurrentPage('home')}
          onAdminClick={() => setCurrentPage('admin')}
        />

        {currentPage === 'home' && <HomePage />}
        
        {currentPage === 'admin' && isAdmin && <AdminPanel />}
        
        {currentPage === 'admin' && !isAdmin && (
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-gray-400 mb-4">You don't have admin privileges.</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </AppProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
