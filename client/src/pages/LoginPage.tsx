import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = await login({ email, password });
      
      if (redirectPath) {
        navigate(redirectPath);
      } else if (user.role === 'admin' || user.role === 'studio') {
        navigate('/admin');
      } else {
        navigate('/paintings');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Return Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={redirectPath || "/"}
          className="inline-flex items-center gap-2 text-xs font-medium text-studio-muted hover:text-studio-terracotta transition-colors py-1.5 px-3 rounded-lg bg-white border border-studio-border shadow-sm hover:border-studio-terracotta/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{redirectPath ? 'Back to Artwork' : 'Back to Home / Atelier'}</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-medium text-studio-muted hover:text-studio-terracotta transition-colors"
        >
          Home
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-studio-border p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <img
            src="/logo.png"
            alt="Kalāranya Art Studio"
            className="h-16 w-auto object-contain mx-auto"
          />
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">Sign in to Kalāranya</h1>
          <p className="text-xs text-studio-muted">
            Access your orders, wall mural bookings, and custom commissions.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patron@example.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-studio-terracotta text-white text-sm font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Sign In
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-studio-muted">
          New to the atelier?{' '}
          <Link to="/register" className="font-semibold text-studio-terracotta hover:underline">
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};
