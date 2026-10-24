import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '';

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await register({ name, email, password });
      navigate(redirectPath || '/paintings');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email may already be registered.');
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
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">Create Customer Account</h1>
          <p className="text-xs text-studio-muted">
            Register to acquire paintings, book murals, and commission bespoke pottery.
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Deshmukh"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya@example.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-studio-terracotta text-white text-sm font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Register Account
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-studio-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-studio-terracotta hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
