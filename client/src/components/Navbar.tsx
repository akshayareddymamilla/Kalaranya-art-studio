import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isStudioAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-studio-ivory/90 backdrop-blur-md border-b border-studio-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Studio Brand */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <img
              src="/logo.png"
              alt="Kalāranya Art Studio & Atelier"
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* User / Auth State */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {isStudioAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-studio-charcoal text-white text-xs font-medium hover:bg-black transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Studio Admin</span>
                  </Link>
                ) : (
                  <Link
                    to="/customer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-studio-sand border border-studio-border text-xs font-medium text-studio-charcoal hover:bg-studio-border/60 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-studio-terracotta" />
                    <span>My Dashboard</span>
                  </Link>
                )}

                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-studio-charcoal">{user.name}</span>
                  <span className="text-[10px] text-studio-muted capitalize font-medium">{user.role}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-studio-muted hover:text-studio-charcoal rounded-lg hover:bg-studio-sand transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-medium text-studio-charcoal hover:text-studio-terracotta transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-studio-terracotta text-white text-xs font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
