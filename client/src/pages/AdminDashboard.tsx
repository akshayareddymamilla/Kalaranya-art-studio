import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Painting, Booking, PotteryRequest } from '../types';
import { paintingService } from '../services/painting.service';
import { bookingService } from '../services/booking.service';
import { potteryService } from '../services/pottery.service';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import {
  Palette,
  Calendar,
  Sparkles,
  Plus,
  Pencil,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isStudioAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'paintings' | 'bookings' | 'pottery'>('paintings');

  // Datasets
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [potteryRequests, setPotteryRequests] = useState<PotteryRequest[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add Painting Modal State
  const [showAddPainting, setShowAddPainting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newArtist, setNewArtist] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newPrice, setNewPrice] = useState<number>(5000);
  const [newImageUrl, setNewImageUrl] = useState<string>('images/p-001.jpg');

  // Edit Painting Modal State
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editArtist, setEditArtist] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(0);

  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allPaintings, allBookings, allPottery] = await Promise.all([
        paintingService.getAll(),
        bookingService.getAll(),
        potteryService.getAll(),
      ]);
      setPaintings(allPaintings);
      setBookings(allBookings);
      setPotteryRequests(allPottery);
    } catch (err: any) {
      setError(err.message || 'Failed to load studio management records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isStudioAdmin) {
      // Not studio admin
      return;
    }
    if (isStudioAdmin) {
      loadAdminData();
    }
  }, [authLoading, isStudioAdmin]);

  if (!authLoading && !isStudioAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-studio-border text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-studio-charcoal">Studio Admin Required</h2>
        <p className="text-sm text-studio-muted">
          You must be logged in with a studio administrator account to view this console.
        </p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 rounded-lg bg-studio-terracotta text-white text-xs font-medium hover:bg-studio-terracotta-hover transition-colors"
        >
          Sign in as Studio Admin
        </Link>
      </div>
    );
  }

  // Admin Actions: Bookings
  const handleConfirmBooking = async (id: string) => {
    try {
      setActionLoading(true);
      setFeedback(null);
      const updated = await bookingService.confirm(id);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setFeedback({ type: 'success', message: `Booking for ${updated.date} confirmed successfully.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to confirm booking.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineBooking = async (id: string) => {
    try {
      setActionLoading(true);
      setFeedback(null);
      const updated = await bookingService.decline(id);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setFeedback({ type: 'success', message: `Booking declined. Scheduled date released.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to decline booking.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Actions: Pottery
  const handleAcceptPottery = async (id: string) => {
    try {
      setActionLoading(true);
      setFeedback(null);
      const updated = await potteryService.accept(id);
      setPotteryRequests((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setFeedback({ type: 'success', message: `Pottery request accepted for production.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to accept request.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclinePottery = async (id: string) => {
    try {
      setActionLoading(true);
      setFeedback(null);
      const updated = await potteryService.decline(id);
      setPotteryRequests((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setFeedback({ type: 'success', message: `Pottery request declined.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to decline request.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Add Painting
  const handleCreatePainting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setFeedback(null);
      const created = await paintingService.create({
        title: newTitle,
        artist: newArtist,
        description: newDescription,
        price: Number(newPrice),
        imageUrl: newImageUrl,
      });
      setPaintings((prev) => [created, ...prev]);
      setFeedback({ type: 'success', message: `Painting "${created.title}" added to gallery successfully.` });
      setShowAddPainting(false);
      setNewTitle('');
      setNewArtist('');
      setNewDescription('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create painting.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Painting
  const handleUpdatePainting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPainting) return;
    try {
      setActionLoading(true);
      setFeedback(null);
      const updated = await paintingService.update(editingPainting.id, {
        title: editTitle,
        artist: editArtist,
        description: editDescription,
        price: Number(editPrice),
      });
      setPaintings((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setFeedback({ type: 'success', message: `Painting "${updated.title}" updated successfully.` });
      setEditingPainting(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update painting.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics
  const availablePaintingsCount = paintings.filter((p) => p.status === 'available').length;
  const soldPaintingsCount = paintings.filter((p) => p.status === 'sold').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'requested').length;
  const pendingPotteryCount = potteryRequests.filter((p) => p.status === 'requested').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-studio-charcoal text-white text-[11px] font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Studio Administrator
          </div>
          <h1 className="text-3xl font-serif font-bold text-studio-charcoal">
            Studio Management Console
          </h1>
          <p className="text-sm text-studio-muted mt-1">
            Manage catalogue paintings, wall-painting schedules, and custom ceramic commissions.
          </p>
        </div>

        <button
          onClick={() => setShowAddPainting(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-studio-terracotta text-white text-xs font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Painting
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-studio-border">
          <span className="text-xs uppercase tracking-wider text-studio-muted font-medium block">
            Available Artwork
          </span>
          <span className="font-serif text-3xl font-bold text-studio-charcoal block mt-1">
            {availablePaintingsCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Ready for acquisition</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-studio-border">
          <span className="text-xs uppercase tracking-wider text-studio-muted font-medium block">
            Sold Artwork
          </span>
          <span className="font-serif text-3xl font-bold text-studio-charcoal block mt-1">
            {soldPaintingsCount}
          </span>
          <span className="text-[11px] text-studio-muted">Completed orders</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-studio-border">
          <span className="text-xs uppercase tracking-wider text-studio-muted font-medium block">
            Mural Requests
          </span>
          <span className="font-serif text-3xl font-bold text-studio-charcoal block mt-1">
            {pendingBookingsCount}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting studio decision</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-studio-border">
          <span className="text-xs uppercase tracking-wider text-studio-muted font-medium block">
            Pottery Requests
          </span>
          <span className="font-serif text-3xl font-bold text-studio-charcoal block mt-1">
            {pendingPotteryCount}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting studio decision</span>
        </div>
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
          <div className="flex-1 text-sm font-medium">{feedback.message}</div>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-60 hover:opacity-100 font-bold px-1">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-studio-border gap-6">
        <button
          onClick={() => setActiveTab('paintings')}
          className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'paintings'
              ? 'border-studio-terracotta text-studio-terracotta'
              : 'border-transparent text-studio-muted hover:text-studio-charcoal'
          }`}
        >
          <Palette className="w-4 h-4" />
          Paintings ({paintings.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'bookings'
              ? 'border-studio-terracotta text-studio-terracotta'
              : 'border-transparent text-studio-muted hover:text-studio-charcoal'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Wall Mural Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('pottery')}
          className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'pottery'
              ? 'border-studio-terracotta text-studio-terracotta'
              : 'border-transparent text-studio-muted hover:text-studio-charcoal'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Pottery Commissions ({potteryRequests.length})
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <LoadingState message="Loading studio management records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAdminData} />
      ) : (
        <div>
          {/* TAB 1: PAINTINGS MANAGEMENT */}
          {activeTab === 'paintings' && (
            <div className="bg-white rounded-2xl border border-studio-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-studio-ivory border-b border-studio-border text-xs uppercase text-studio-muted tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Artwork</th>
                      <th className="px-6 py-4">Artist</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-studio-border">
                    {paintings.map((painting) => {
                      const isAvailable = painting.status === 'available';

                      return (
                        <tr key={painting.id} className="hover:bg-studio-ivory/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`/${painting.imageUrl}`}
                                alt={painting.title}
                                className="w-12 h-12 object-cover rounded-lg border border-studio-border bg-studio-sand shrink-0"
                              />
                              <div>
                                <span className="font-serif font-bold text-studio-charcoal block">
                                  {painting.title}
                                </span>
                                <span className="text-xs text-studio-muted">ID: {painting.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-studio-charcoal">{painting.artist}</td>
                          <td className="px-6 py-4 font-serif font-semibold text-studio-charcoal">
                            ₹{painting.price.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={painting.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isAvailable ? (
                              <button
                                onClick={() => {
                                  setEditingPainting(painting);
                                  setEditTitle(painting.title);
                                  setEditArtist(painting.artist);
                                  setEditDescription(painting.description);
                                  setEditPrice(painting.price);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-studio-border text-xs font-medium text-studio-charcoal hover:bg-studio-sand transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5 text-studio-muted" />
                                Edit Artwork
                              </button>
                            ) : (
                              <span
                                title="Sold paintings cannot be edited according to studio business rules."
                                className="text-xs text-stone-400 cursor-not-allowed italic"
                              >
                                Locked (Sold)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: WALL BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl border border-studio-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-studio-ivory border-b border-studio-border text-xs uppercase text-studio-muted tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Dimensions</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Decisions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-studio-border">
                    {bookings.map((booking) => {
                      const isPending = booking.status === 'requested';

                      return (
                        <tr key={booking.id} className="hover:bg-studio-ivory/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-studio-charcoal">{booking.date}</td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-studio-charcoal block">
                              {booking.user?.name || 'Customer'}
                            </span>
                            <span className="text-xs text-studio-muted font-mono">{booking.user?.email}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-studio-charcoal">{booking.wallSize} sq ft</td>
                          <td className="px-6 py-4 font-serif font-semibold text-studio-charcoal">
                            ₹{booking.totalPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-xs text-studio-muted max-w-xs truncate">
                            {booking.address}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleConfirmBooking(booking.id)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleDeclineBooking(booking.id)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-50 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-studio-muted italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM POTTERY MANAGEMENT */}
          {activeTab === 'pottery' && (
            <div className="bg-white rounded-2xl border border-studio-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-studio-ivory border-b border-studio-border text-xs uppercase text-studio-muted tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Ceramic Item</th>
                      <th className="px-6 py-4">Glaze</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Needed By</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Decisions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-studio-border">
                    {potteryRequests.map((req) => {
                      const isPending = req.status === 'requested';

                      return (
                        <tr key={req.id} className="hover:bg-studio-ivory/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium text-studio-charcoal block">
                              {req.user?.name || 'Customer'}
                            </span>
                            <span className="text-xs text-studio-muted font-mono">{req.user?.email}</span>
                          </td>
                          <td className="px-6 py-4 font-serif font-bold text-studio-charcoal">
                            {req.item?.name || req.itemId}
                            {req.notes && (
                              <span className="text-xs font-sans text-studio-muted block truncate max-w-xs mt-0.5">
                                Notes: {req.notes}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-studio-charcoal">{req.glaze?.name}</td>
                          <td className="px-6 py-4 text-studio-charcoal font-medium">{req.quantity} pcs</td>
                          <td className="px-6 py-4 text-xs text-studio-muted">{req.neededByDate}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={req.status} />
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleAcceptPottery(req.id)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDeclinePottery(req.id)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-50 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-studio-muted italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New Painting */}
      {showAddPainting && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-studio-border relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl font-bold text-studio-charcoal mb-4">
              Add New Original Painting
            </h3>

            <form onSubmit={handleCreatePainting} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warli Harvest Celebration"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Vayeda"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Traditional style, medium, pigments, and dimensions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Price (INR)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Image Path / Asset URL
                </label>
                <input
                  type="text"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
                <span className="text-[11px] text-studio-muted mt-1 block">
                  e.g. images/p-001.jpg (served from studio gallery storage)
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
                <button
                  type="button"
                  onClick={() => setShowAddPainting(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg border border-studio-border text-sm font-medium text-studio-charcoal hover:bg-studio-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-studio-terracotta text-white text-sm font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm flex items-center gap-2"
                >
                  {actionLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Available Painting */}
      {editingPainting && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-studio-border relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl font-bold text-studio-charcoal mb-4">
              Edit Painting (Available Only)
            </h3>

            <form onSubmit={handleUpdatePainting} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  required
                  value={editArtist}
                  onChange={(e) => setEditArtist(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Price (INR)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
                <button
                  type="button"
                  onClick={() => setEditingPainting(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg border border-studio-border text-sm font-medium text-studio-charcoal hover:bg-studio-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-studio-terracotta text-white text-sm font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm flex items-center gap-2"
                >
                  {actionLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
