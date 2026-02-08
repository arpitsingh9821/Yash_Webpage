import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: 'home' | 'admin';
  onHomeClick: () => void;
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onHomeClick, onAdminClick }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer" 
            onClick={onHomeClick}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ALWAYS <span className="text-red-500">DEMON</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest">EXCLUSIVE COLLECTION</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-xs">{user.role}</p>
                </div>
              </div>
            )}

            {currentPage === 'admin' ? (
              <button
                onClick={onHomeClick}
                className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                ← Back to Store
              </button>
            ) : (
              isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )
            )}

            <button
              onClick={logout}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
