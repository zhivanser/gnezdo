import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const baseLinkClass = "transition-all duration-200 pb-1 flex items-center gap-1";
  const activeLinkClass = "text-gnezdo-orange border-b-2 border-gnezdo-orange";
  const inactiveLinkClass = "opacity-70 hover:opacity-100 text-gnezdo-brown";

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gnezdo-orange/20 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
        
        <Link to="/" className="font-bold text-gnezdo-orange text-2xl tracking-tight">
          Гнездо
        </Link>
        
        <nav className="flex gap-4 text-sm font-semibold items-center">
          
          <Link 
            to="/about" 
            className={`${baseLinkClass} ${isActive('/about') ? activeLinkClass : inactiveLinkClass}`}
          >
            О нас
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className={`${baseLinkClass} ${isActive('/profile') ? activeLinkClass : inactiveLinkClass}`}
              >
                Анкета
              </Link>
              
              <Link 
                to="/dashboard" 
                className={`${baseLinkClass} ${isActive('/dashboard') ? activeLinkClass : inactiveLinkClass}`}
              >
                <User size={14} />
                {user?.email?.split('@')[0] || 'ЛК'}
              </Link>
              
              <button 
                onClick={logout}
                className="opacity-70 hover:opacity-100 text-gnezdo-brown transition-all p-1"
                title="Выйти"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              className={`${baseLinkClass} ${isActive('/auth') ? activeLinkClass : inactiveLinkClass}`}
            >
              Войти
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
}
