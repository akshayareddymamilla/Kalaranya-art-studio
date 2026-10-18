import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Painting } from '../types';
import { paintingService } from '../services/painting.service';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmModal } from '../components/ConfirmModal';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const PaintingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isStudioAdmin } = useAuth();

  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPainting = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await paintingService.getById(id);
      setPainting(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load painting details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPainting();
  }, [id]);

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/paintings/${id}`);
      return;
    }
    if (isStudioAdmin) {
      setFeedback({
        type: 'error',
        message: 'Studio admins cannot purchase artwork. Log in as a customer.',
      });
      return;
    }
    setShowConfirm(true);
  };

  const confirmPurchase = async () => {
    if (!painting) return;
    try {
      setPurchasing(true);
      setFeedback(null);
      await paintingService.purchase(painting.id);
      setPainting({ ...painting, status: 'sold' });
      setFeedback({
        type: 'success',
        message: `You have successfully purchased "${painting.title}". An order has been placed in your account.`,
      });
      setShowConfirm(false);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Conflict: This painting has already been purchased.',
      });
      fetchPainting();
      setShowConfirm(false);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingState message="Loading artwork details..." />
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Painting Not Found"
          message={error || 'The requested painting could not be located in our collection.'}
          onRetry={fetchPainting}
        />
        <div className="text-center mt-4">
          <Link to="/paintings" className="text-sm font-medium text-studio-terracotta underline">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = painting.status === 'available';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/paintings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-studio-muted hover:text-studio-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </Link>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 border animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-medium">
            {feedback.message}
            {feedback.type === 'success' && (
              <div className="mt-2">
                <Link
                  to="/customer"
                  className="inline-flex items-center text-xs font-semibold underline text-emerald-800 hover:text-emerald-950"
                >
                  View your order in My Dashboard →
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-2xl border border-studio-border p-6 sm:p-10 shadow-sm">
        {/* Artwork Image Container */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-studio-sand border border-studio-border aspect-[4/3]">
            <img
              src={`/${painting.imageUrl}`}
              alt={painting.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-studio-muted px-1">
            <span>Identifier: {painting.id}</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Verified Original Piece
            </span>
          </div>
        </div>

        {/* Artwork Details & Purchase Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-studio-terracotta">
                Fine Art Original
              </span>
              <StatusBadge status={painting.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-studio-charcoal leading-snug">
              {painting.title}
            </h1>

            <p className="text-sm font-medium text-studio-charcoal">
              Artist: <span className="font-semibold text-studio-terracotta">{painting.artist}</span>
            </p>

            <div className="border-t border-b border-studio-border py-4 my-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-studio-muted block mb-2">
                Curatorial Description
              </span>
              <p className="text-sm text-studio-muted leading-relaxed whitespace-pre-line">
                {painting.description}
              </p>
            </div>

            <div className="bg-studio-ivory p-4 rounded-xl border border-studio-border space-y-1">
              <span className="text-xs font-medium text-studio-muted">Investment Price</span>
              <div className="text-3xl font-serif font-bold text-studio-charcoal">
                ₹{painting.price.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-studio-muted block">
                Inclusive of documentation & authenticity certificate.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-3 pt-4">
            {isAvailable ? (
              <button
                onClick={handleBuy}
                className="w-full py-3.5 px-6 rounded-xl bg-studio-terracotta text-white font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Acquire Artwork (₹{painting.price.toLocaleString('en-IN')})
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-center text-sm font-medium text-stone-600">
                This one-of-a-kind artwork has already been sold.
              </div>
            )}

            {!isAuthenticated && isAvailable && (
              <p className="text-center text-xs text-studio-muted">
                You will be asked to sign in as a customer to complete purchase.
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Painting Purchase"
        message={`Are you sure you wish to acquire "${painting.title}" by ${painting.artist} for ₹${painting.price.toLocaleString('en-IN')}?`}
        confirmLabel="Confirm & Place Order"
        cancelLabel="Cancel"
        isDestructive={false}
        isLoading={purchasing}
        onConfirm={confirmPurchase}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
