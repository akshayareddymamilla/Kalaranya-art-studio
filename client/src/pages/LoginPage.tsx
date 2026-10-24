import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

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

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
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

        {/* Studio Admin Seed Account Helper */}
        <div className="pt-4 border-t border-studio-border/70 space-y-2">
          <button
            type="button"
            onClick={() => handleFillDemo('studio@artstudio.in', 'Studio@123')}
            className="w-full p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 transition-colors text-left flex items-center justify-between text-amber-900"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="text-xs font-bold block leading-none">Studio Administrator (Seed Account)</span>
                <span className="text-[10px] text-amber-800">studio@artstudio.in</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-semibold text-amber-800">Fill Credentials</span>
          </button>
        </div>

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
