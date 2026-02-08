import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAdminClick: () => void;
  showAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, showAdmin }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-red-900/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">👹</span>
            </div>
            <span className="text-xl font-bold text-white">
              Always <span className="text-red-500">Demon</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-gray-300 hover:text-red-500 transition-colors">Home</a>
            <a href="#products" className="text-gray-300 hover:text-red-500 transition-colors">Products</a>
            <a href="#about" className="text-gray-300 hover:text-red-500 transition-colors">About</a>
            
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">
                  Welcome, <span className="text-red-400">{user?.username}</span>
                  {user?.isAdmin && <span className="ml-1 text-xs bg-red-600 px-2 py-0.5 rounded">Admin</span>}
                </span>
                
                {user?.isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      showAdmin 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {showAdmin ? 'View Store' : 'Admin Panel'}
                  </button>
                )}
                
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="text-gray-300 hover:text-red-500 transition-colors py-2">Home</a>
              <a href="#products" className="text-gray-300 hover:text-red-500 transition-colors py-2">Products</a>
              <a href="#about" className="text-gray-300 hover:text-red-500 transition-colors py-2">About</a>
              
              {isAuthenticated && (
                <>
                  <div className="text-gray-400 text-sm py-2">
                    Welcome, <span className="text-red-400">{user?.username}</span>
                    {user?.isAdmin && <span className="ml-1 text-xs bg-red-600 px-2 py-0.5 rounded">Admin</span>}
                  </div>
                  
                  {user?.isAdmin && (
                    <button
                      onClick={() => {
                        onAdminClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg transition-all text-left ${
                        showAdmin 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {showAdmin ? 'View Store' : 'Admin Panel'}
                    </button>
                  )}
                  
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
