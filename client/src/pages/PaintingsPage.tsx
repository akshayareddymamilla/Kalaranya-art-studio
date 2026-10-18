import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Painting } from '../types';
import { paintingService } from '../services/painting.service';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmModal } from '../components/ConfirmModal';
import { Search, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

export const PaintingsPage: React.FC = () => {
  const { isAuthenticated, isStudioAdmin } = useAuth();
  const navigate = useNavigate();

  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Purchase Modal State
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPaintings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paintingService.getAll();
      setPaintings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load paintings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  // Filter and sort logic
  const filteredPaintings = paintings.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0; // natural seed order
  });

  const handleBuyClick = (painting: Painting) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/paintings');
      return;
    }
    if (isStudioAdmin) {
      setFeedback({
        type: 'error',
        message: 'Studio admins cannot purchase paintings. Please log in as a customer.',
      });
      return;
    }
    setSelectedPainting(painting);
  };

  const confirmPurchase = async () => {
    if (!selectedPainting) return;
    try {
      setPurchasing(true);
      setFeedback(null);
      await paintingService.purchase(selectedPainting.id);
      
      // Update local state to sold
      setPaintings((prev) =>
        prev.map((p) =>
          p.id === selectedPainting.id ? { ...p, status: 'sold' } : p
        )
      );

      setFeedback({
        type: 'success',
        message: `Congratulations! "${selectedPainting.title}" has been successfully purchased and reserved for you.`,
      });
      setSelectedPainting(null);
    } catch (err: any) {
      // Show clear conflict message
      setFeedback({
        type: 'error',
        message: err.message || 'Conflict: This painting was just purchased by someone else.',
      });
      // Refresh paintings list to reflect real availability
      fetchPaintings();
      setSelectedPainting(null);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-studio-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-studio-terracotta block">
            Original Artworks
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-studio-charcoal mt-1">
            Painting Catalogue
          </h1>
          <p className="text-sm text-studio-muted mt-1 max-w-xl">
            Each piece is an authentic original from traditional Indian schools. Due to their unique nature, each painting can be acquired only once.
          </p>
        </div>

        {/* Action button for admin */}
        {isStudioAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-studio-charcoal text-white text-xs font-medium hover:bg-black transition-colors"
          >
            Manage / Add Paintings
          </Link>
        )}
      </div>

      {/* Feedback Banner */}
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

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-studio-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, artist, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-studio-ivory rounded-lg border border-studio-border focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-studio-muted font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <div className="inline-flex rounded-lg border border-studio-border p-0.5 bg-studio-ivory text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-studio-charcoal shadow-sm'
                  : 'text-studio-muted hover:text-studio-charcoal'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'available'
                  ? 'bg-white text-studio-charcoal shadow-sm'
                  : 'text-studio-muted hover:text-studio-charcoal'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setStatusFilter('sold')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'sold'
                  ? 'bg-white text-studio-charcoal shadow-sm'
                  : 'text-studio-muted hover:text-studio-charcoal'
              }`}
            >
              Sold
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs bg-studio-ivory border border-studio-border rounded-lg px-3 py-1.5 font-medium text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20"
          >
            <option value="featured">Featured Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Loading painting catalogue..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPaintings} />
      ) : filteredPaintings.length === 0 ? (
        <EmptyState
          title="No paintings found"
          description="Try adjusting your search terms or filter criteria to see available artwork."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPaintings.map((painting) => {
            const isAvailable = painting.status === 'available';

            return (
              <div
                key={painting.id}
                className="group bg-white rounded-xl overflow-hidden border border-studio-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Painting Image */}
                <Link
                  to={`/paintings/${painting.id}`}
                  className="relative aspect-[4/3] bg-studio-sand overflow-hidden block"
                >
                  <img
                    src={`/${painting.imageUrl}`}
                    alt={painting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={painting.status} />
                  </div>
                </Link>

                {/* Painting Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-studio-muted">{painting.artist}</span>
                    <Link
                      to={`/paintings/${painting.id}`}
                      className="font-serif text-base font-semibold text-studio-charcoal mt-1 line-clamp-1 hover:text-studio-terracotta transition-colors block"
                    >
                      {painting.title}
                    </Link>
                    <p className="text-xs text-studio-muted mt-2 line-clamp-2 leading-relaxed">
                      {painting.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-studio-border/60 mt-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-studio-muted block">Price</span>
                      <span className="font-serif text-lg font-bold text-studio-charcoal">
                        ₹{painting.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/paintings/${painting.id}`}
                        className="px-3 py-1.5 rounded-lg border border-studio-border text-xs font-medium text-studio-charcoal hover:bg-studio-ivory transition-colors"
                      >
                        Details
                      </Link>

                      {isAvailable ? (
                        <button
                          onClick={() => handleBuyClick(painting)}
                          className="px-3.5 py-1.5 rounded-lg bg-studio-terracotta text-white text-xs font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm"
                        >
                          Buy
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-500 text-xs font-medium cursor-not-allowed">
                          Sold
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for Purchase */}
      <ConfirmModal
        isOpen={!!selectedPainting}
        title="Confirm Painting Purchase"
        message={
          selectedPainting
            ? `Are you sure you wish to acquire "${selectedPainting.title}" by ${selectedPainting.artist} for ₹${selectedPainting.price.toLocaleString('en-IN')}? This will create an order and mark the original artwork as sold.`
            : ''
        }
        confirmLabel="Confirm & Place Order"
        cancelLabel="Cancel"
        isDestructive={false}
        isLoading={purchasing}
        onConfirm={confirmPurchase}
        onCancel={() => setSelectedPainting(null)}
      />
    </div>
  );
};
