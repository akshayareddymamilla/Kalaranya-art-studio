import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

const TICKER_ITEMS = [
  'EACH PAINTING 100% ORIGINAL & ONE-OF-A-KIND',
  'HAND-FINISHED & ARCHIVALLY FRAMED IN BENGALURU',
  'CERTIFICATE OF AUTHENTICITY WITH EVERY MASTERPIECE',
  'ARCHITECTURAL WALL MURALS @ FLAT ₹150 / SQ FT',
  'BESPOKE GLAZED TERRACOTTA POTTERY',
  'PAN-INDIA INSURED ART COURIER',
  'PAYMENT ON DELIVERY AVAILABLE FOR VERIFIED ORDERS'
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isStudioAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Top Announcement Marquee Bar */}
      <div className="bg-[#8A381A] text-amber-50 border-b border-[#732E14] overflow-hidden py-1.5 select-none shadow-sm">
        <div className="animate-marquee whitespace-nowrap text-[10.5px] font-medium tracking-widest uppercase text-amber-50/95">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex items-center shrink-0">
              {TICKER_ITEMS.map((item, idx) => (
                <span key={idx} className="flex items-center">
                  <span className="text-amber-300 mx-3.5 text-xs leading-none">•</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-studio-ivory/95 backdrop-blur-md border-b border-studio-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Studio Brand */}
          <Link to="/" className="flex items-center gap-3 group py-0.5">
            <img
              src="/logo-horizontal.png"
              alt="Kalāranya Art Studio & Atelier"
              className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-studio-charcoal">
            <Link
              to="/"
              className="hover:text-studio-terracotta transition-colors py-1"
            >
              Home
            </Link>
            <Link
              to="/paintings"
              className="hover:text-studio-terracotta transition-colors py-1"
            >
              Paintings
            </Link>
            <Link
              to="/book-wall"
              className="hover:text-studio-terracotta transition-colors py-1"
            >
              Wall Murals
            </Link>
            <Link
              to="/custom-pottery"
              className="hover:text-studio-terracotta transition-colors py-1"
            >
              Custom Pottery
            </Link>
          </nav>

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
      </div>
    </header>
  );
};
