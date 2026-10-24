import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { potteryService } from '../services/pottery.service';
import { PotteryItem, Glaze } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { Sparkles, Calendar, Hash, FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const PotteryRequestForm: React.FC = () => {
  const { isAuthenticated, isStudioAdmin } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<PotteryItem[]>([]);
  const [glazes, setGlazes] = useState<Glaze[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedGlazeId, setSelectedGlazeId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(2);
  const [neededByDate, setNeededByDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper date boundary: at least 14 days in the future
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const minDate = getMinDate();

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        const data = await potteryService.getOptions();
        setItems(data.items || []);
        setGlazes(data.glazes || []);
        if (data.items.length > 0) setSelectedItemId(data.items[0].id);
        if (data.glazes.length > 0) setSelectedGlazeId(data.glazes[0].id);
      } catch (err: any) {
        setError('Failed to load pottery catalogue options.');
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/custom-pottery');
      return;
    }
    if (isStudioAdmin) {
      setError('Studio admins cannot commission custom pottery. Please log in as a customer.');
      return;
    }

    if (quantity < 1 || quantity > 12) {
      setError('Quantity must be between 1 and 12 pieces.');
      return;
    }

    if (!neededByDate) {
      setError('Please specify your needed-by date.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await potteryService.create({
        itemId: selectedItemId,
        glazeId: selectedGlazeId,
        quantity: Number(quantity),
        neededByDate,
        notes: notes.trim() || undefined,
      });

      setSuccessMessage('Your custom pottery commission has been submitted! The studio will review your request.');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit pottery request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-studio-muted hover:text-studio-terracotta transition-colors py-1.5 px-3 rounded-lg bg-white border border-studio-border shadow-sm hover:border-studio-terracotta/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home / Atelier</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-studio-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-studio-terracotta block">
          Custom Ceramics
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-studio-charcoal mt-1">
          Commission Custom Studio Pottery
        </h1>
        <p className="text-sm text-studio-muted mt-2 max-w-2xl leading-relaxed">
          Select handcrafted terracotta items and heritage mineral glazes. Each piece is wheel-thrown, kiln-fired, and glazed by hand. Due to firing schedules, commissions require at least 14 days lead time.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            {successMessage}
            <div className="mt-2">
              <Link to="/customer" className="underline font-semibold text-emerald-800 hover:text-emerald-950 text-xs">
                View your request in My Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{error}</div>
          <button onClick={() => setError(null)} className="text-xs font-bold opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading pottery catalogue..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-studio-border p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                  1. Choose Pottery Item
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${
                        selectedItemId === item.id
                          ? 'border-studio-terracotta bg-studio-terracotta/5 ring-1 ring-studio-terracotta font-medium text-studio-charcoal'
                          : 'border-studio-border hover:bg-studio-ivory text-studio-muted'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-studio-terracotta" />
                        {item.name}
                      </span>
                      <input
                        type="radio"
                        name="potteryItem"
                        value={item.id}
                        checked={selectedItemId === item.id}
                        onChange={() => setSelectedItemId(item.id)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Glaze Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                  2. Choose Artisanal Glaze
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {glazes.map((glaze) => (
                    <label
                      key={glaze.id}
                      className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                        selectedGlazeId === glaze.id
                          ? 'border-studio-terracotta bg-studio-terracotta/5 ring-1 ring-studio-terracotta font-medium text-studio-charcoal'
                          : 'border-studio-border hover:bg-studio-ivory text-studio-muted'
                      }`}
                    >
                      <span className="font-semibold text-studio-charcoal">{glaze.name}</span>
                      <input
                        type="radio"
                        name="potteryGlaze"
                        value={glaze.id}
                        checked={selectedGlazeId === glaze.id}
                        onChange={() => setSelectedGlazeId(glaze.id)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity and Date in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Quantity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                      3. Quantity (1–12)
                    </label>
                    <span className="text-xs font-mono font-bold text-studio-terracotta bg-studio-sand px-2 py-0.5 rounded">
                      {quantity} {quantity === 1 ? 'piece' : 'pieces'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-studio-muted" />
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                    />
                  </div>
                </div>

                {/* Needed By Date */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                    4. Needed-By Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-studio-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={minDate}
                      value={neededByDate}
                      onChange={(e) => setNeededByDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                    />
                  </div>
                  <p className="text-[11px] text-studio-muted">
                    Min 14 days lead time (from {minDate})
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                  5. Customization Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-studio-muted absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    placeholder="Specific dimensions, intended use, or gift wrapping preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !neededByDate}
                className="w-full py-3 px-6 rounded-xl bg-studio-terracotta text-white font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Submit Custom Commission Request
              </button>
            </form>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-studio-ivory rounded-2xl border border-studio-border p-6 space-y-4 text-xs text-studio-muted">
              <h4 className="font-serif font-bold text-base text-studio-charcoal">
                Pottery Commission Workflow
              </h4>
              <ol className="space-y-3 list-decimal list-inside leading-relaxed">
                <li><strong>Review:</strong> The studio reviews item complexity and kiln availability.</li>
                <li><strong>Modifications:</strong> You may edit or cancel your request freely while it remains in <strong>requested</strong> status.</li>
                <li><strong>Studio Decision:</strong> Once the studio <strong>accepts</strong> or <strong>declines</strong>, the commission is locked to preserve production schedules.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
