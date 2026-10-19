import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order, Booking, PotteryRequest } from '../types';
import { paintingService } from '../services/painting.service';
import { bookingService } from '../services/booking.service';
import { potteryService } from '../services/pottery.service';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Palette,
  Calendar,
  Sparkles,
  Ban,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Plus,
  Award,
  Printer,
  X
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'paintings' | 'bookings' | 'pottery'>('paintings');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [potteryRequests, setPotteryRequests] = useState<PotteryRequest[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cancellation Modal States
  const [cancelModal, setCancelModal] = useState<{
    type: 'order' | 'booking' | 'pottery';
    id: string;
    title: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Pottery Edit Modal State
  const [editPottery, setEditPottery] = useState<PotteryRequest | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [editNotes, setEditNotes] = useState<string>('');

  // Certificate Modal State
  const [selectedCertificateOrder, setSelectedCertificateOrder] = useState<Order | null>(null);

  const loadAllCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userOrders, userBookings, userPottery] = await Promise.all([
        paintingService.getOrders(),
        bookingService.getAll(),
        potteryService.getAll(),
      ]);
      setOrders(userOrders);
      setBookings(userBookings);
      setPotteryRequests(userPottery);
    } catch (err: any) {
      setError(err.message || 'Failed to load your account records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCustomerData();
  }, []);

  // Helper to check 3-day cutoff for booking cancellation
  const canCancelBooking = (bookingDate: string): boolean => {
    const today = new Date();
    const parts = bookingDate.split('-');
    const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const handleConfirmCancel = async () => {
    if (!cancelModal) return;
    try {
      setActionLoading(true);
      setFeedback(null);

      if (cancelModal.type === 'order') {
        const updated = await paintingService.cancelOrder(cancelModal.id);
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setFeedback({
          type: 'success',
          message: 'Order cancelled successfully. Painting has been returned to gallery availability.',
        });
      } else if (cancelModal.type === 'booking') {
        const updated = await bookingService.cancel(cancelModal.id);
        setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setFeedback({
          type: 'success',
          message: 'Wall mural booking cancelled. Scheduled date has been released.',
        });
      } else if (cancelModal.type === 'pottery') {
        const updated = await potteryService.cancel(cancelModal.id);
        setPotteryRequests((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setFeedback({
          type: 'success',
          message: 'Custom pottery request cancelled successfully.',
        });
      }

      setCancelModal(null);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to cancel item.',
      });
      setCancelModal(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePotteryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPottery) return;
    try {
      setActionLoading(true);
      setFeedback(null);
      const updated = await potteryService.update(editPottery.id, {
        quantity: editQuantity,
        notes: editNotes,
      });
      setPotteryRequests((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setFeedback({
        type: 'success',
        message: 'Pottery request updated successfully.',
      });
      setEditPottery(null);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update pottery request.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-studio-terracotta block">
            Customer Atelier
          </span>
          <h1 className="text-3xl font-serif font-bold text-studio-charcoal mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-studio-muted mt-1">
            Manage your fine art acquisitions, scheduled wall murals, and bespoke pottery commissions.
          </p>
        </div>

        {/* Quick action commission buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/book-wall"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-studio-border text-xs font-medium text-studio-charcoal hover:bg-studio-sand transition-colors shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-studio-terracotta" />
            Book Mural
          </Link>
          <Link
            to="/custom-pottery"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-studio-terracotta text-white text-xs font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Request Pottery
          </Link>
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
          My Painting Orders ({orders.length})
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
          Custom Pottery ({potteryRequests.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingState message="Fetching your atelier records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAllCustomerData} />
      ) : (
        <div>
          {/* TAB 1: PAINTING ORDERS */}
          {activeTab === 'paintings' && (
            <div>
              {orders.length === 0 ? (
                <EmptyState
                  icon={Palette}
                  title="No paintings acquired yet"
                  description="You have not purchased any original paintings from our gallery. Browse our curated collection to acquire unique masterpieces."
                  actionText="Browse Paintings"
                  actionHref="/paintings"
                />
              ) : (
                <div className="bg-white rounded-2xl border border-studio-border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-studio-ivory border-b border-studio-border text-xs uppercase text-studio-muted tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Artwork</th>
                          <th className="px-6 py-4">Artist</th>
                          <th className="px-6 py-4">Investment</th>
                          <th className="px-6 py-4">Date Placed</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-studio-border">
                        {orders.map((order) => {
                          const isPlaced = order.status === 'placed';

                          return (
                            <tr key={order.id} className="hover:bg-studio-ivory/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`/${order.painting?.imageUrl || 'images/p-001.jpg'}`}
                                    alt={order.painting?.title}
                                    className="w-12 h-12 object-cover rounded-lg border border-studio-border bg-studio-sand shrink-0"
                                  />
                                  <div>
                                    <span className="font-serif font-bold text-studio-charcoal block">
                                      {order.painting?.title || 'Original Artwork'}
                                    </span>
                                    <span className="text-xs text-studio-muted">Order ID: {order.id.slice(0, 8)}...</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-studio-charcoal">
                                {order.painting?.artist}
                              </td>
                              <td className="px-6 py-4 font-serif font-semibold text-studio-charcoal">
                                ₹{order.price.toLocaleString('en-IN')}
                              </td>
                              <td className="px-6 py-4 text-xs text-studio-muted">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="px-6 py-4 text-right">
                                {isPlaced ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setSelectedCertificateOrder(order)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/70 text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors shadow-sm"
                                    >
                                      <Award className="w-3.5 h-3.5 text-amber-700" />
                                      Certificate
                                    </button>
                                    <button
                                      onClick={() =>
                                        setCancelModal({
                                          type: 'order',
                                          id: order.id,
                                          title: `Cancel order for "${order.painting?.title}"`,
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                      Cancel Order
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-studio-muted italic">Cancelled</span>
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

          {/* TAB 2: WALL BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              {bookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No wall murals booked"
                  description="Transform your home or workplace with a custom architectural mural. Schedule a date between 7 and 90 days out."
                  actionText="Book Wall Mural"
                  actionHref="/book-wall"
                />
              ) : (
                <div className="bg-white rounded-2xl border border-studio-border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-studio-ivory border-b border-studio-border text-xs uppercase text-studio-muted tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Scheduled Date</th>
                          <th className="px-6 py-4">Wall Area</th>
                          <th className="px-6 py-4">Total Price</th>
                          <th className="px-6 py-4">Premises Address</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-studio-border">
                        {bookings.map((booking) => {
                          const canCancel =
                            (booking.status === 'requested' || booking.status === 'confirmed') &&
                            canCancelBooking(booking.date);
                          const isPastCutoff =
                            (booking.status === 'requested' || booking.status === 'confirmed') &&
                            !canCancelBooking(booking.date);

                          return (
                            <tr key={booking.id} className="hover:bg-studio-ivory/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-studio-charcoal">
                                {booking.date}
                              </td>
                              <td className="px-6 py-4 text-studio-charcoal font-medium">
                                {booking.wallSize} sq ft
                                <span className="text-xs text-studio-muted block">
                                  @ ₹{booking.ratePerSqFt}/sq ft
                                </span>
                              </td>
                              <td className="px-6 py-4 font-serif font-semibold text-studio-charcoal">
                                ₹{booking.totalPrice.toLocaleString('en-IN')}
                              </td>
                              <td className="px-6 py-4 text-xs text-studio-muted max-w-xs truncate">
                                {booking.address}
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={booking.status} />
                              </td>
                              <td className="px-6 py-4 text-right">
                                {canCancel ? (
                                  <button
                                    onClick={() =>
                                      setCancelModal({
                                        type: 'booking',
                                        id: booking.id,
                                        title: `Cancel wall booking for ${booking.date}`,
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    Cancel Booking
                                  </button>
                                ) : isPastCutoff ? (
                                  <span
                                    title="Cancellation is only permitted at least 3 days before the scheduled date."
                                    className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full cursor-help"
                                  >
                                    Cutoff passed (&lt;3 days)
                                  </span>
                                ) : (
                                  <span className="text-xs text-studio-muted italic">—</span>
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

          {/* TAB 3: CUSTOM POTTERY */}
          {activeTab === 'pottery' && (
            <div>
              {potteryRequests.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No custom pottery commissions"
                  description="Commission bespoke wheel-thrown clay cups, surahis, or planters dipped in traditional glazes."
                  actionText="Request Custom Pottery"
                  actionHref="/custom-pottery"
                />
              ) : (
                <div className="bg-white rounded-2xl border border-studio-border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-studio-ivory border-b border-studio-border text-xs uppercase text-studio-muted tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Ceramic Item</th>
                          <th className="px-6 py-4">Artisanal Glaze</th>
                          <th className="px-6 py-4">Quantity</th>
                          <th className="px-6 py-4">Needed-By Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-studio-border">
                        {potteryRequests.map((req) => {
                          const isEditable = req.status === 'requested';

                          return (
                            <tr key={req.id} className="hover:bg-studio-ivory/50 transition-colors">
                              <td className="px-6 py-4 font-serif font-bold text-studio-charcoal">
                                {req.item?.name || req.itemId}
                                {req.notes && (
                                  <span className="text-xs font-sans text-studio-muted block truncate max-w-xs mt-0.5">
                                    Notes: {req.notes}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-medium text-studio-charcoal">
                                {req.glaze?.name || req.glazeId}
                              </td>
                              <td className="px-6 py-4 text-studio-charcoal font-medium">
                                {req.quantity} pcs
                              </td>
                              <td className="px-6 py-4 text-xs text-studio-muted">
                                {req.neededByDate}
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={req.status} />
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                {isEditable ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditPottery(req);
                                        setEditQuantity(req.quantity);
                                        setEditNotes(req.notes || '');
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-studio-border text-xs font-medium text-studio-charcoal hover:bg-studio-sand transition-colors"
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-studio-muted" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        setCancelModal({
                                          type: 'pottery',
                                          id: req.id,
                                          title: `Cancel custom pottery request for "${req.item?.name}"`,
                                        })
                                      }
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-studio-muted italic">
                                    Locked ({req.status})
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
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!cancelModal}
        title="Confirm Cancellation"
        message={
          cancelModal
            ? `Are you sure you want to proceed with: ${cancelModal.title}? This action is irreversible.`
            : ''
        }
        confirmLabel="Yes, Cancel It"
        cancelLabel="Keep Active"
        isDestructive={true}
        isLoading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModal(null)}
      />

      {/* Pottery Edit Modal */}
      {editPottery && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-studio-border relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl font-bold text-studio-charcoal mb-2">
              Edit Pottery Commission
            </h3>
            <p className="text-xs text-studio-muted mb-6">
              Item: <strong>{editPottery.item?.name}</strong> • Glaze: <strong>{editPottery.glaze?.name}</strong>
            </p>

            <form onSubmit={handleSavePotteryEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Quantity (1–12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
                <button
                  type="button"
                  onClick={() => setEditPottery(null)}
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

      {/* Certificate of Authenticity Modal */}
      {selectedCertificateOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-50 rounded-2xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-900/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCertificateOrder(null)}
              className="absolute top-4 right-4 text-studio-muted hover:text-studio-charcoal p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Document Border Box */}
            <div className="border-2 border-amber-900/40 p-6 sm:p-8 bg-white relative">
              {/* Corner Ornaments */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-900/60" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-900/60" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-900/60" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-900/60" />

              {/* Certificate Header */}
              <div className="text-center space-y-1 mb-6 border-b border-amber-900/20 pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-studio-muted font-bold block">
                  KALĀRANYA ART STUDIO & ATELIER
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 tracking-wider">
                  CERTIFICATE OF AUTHENTICITY
                </h2>
                <p className="text-xs text-studio-muted italic">
                  Permanent Registry of Original Contemporary & Heritage Works
                </p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 text-xs sm:text-sm text-studio-charcoal leading-relaxed">
                <p className="text-center text-studio-muted italic">
                  This document officially certifies that the original artwork described herein is a genuine, one-of-a-kind handcrafted piece created by the designated artisan and preserved under studio archive records.
                </p>

                <div className="bg-studio-ivory/60 rounded-xl p-4 border border-studio-border/80 space-y-2 mt-4">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-studio-muted text-xs uppercase">Artwork Title:</span>
                    <span className="col-span-2 font-serif font-bold text-base text-studio-charcoal">
                      {selectedCertificateOrder.painting?.title}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-studio-muted text-xs uppercase">Master Artist:</span>
                    <span className="col-span-2 font-medium text-studio-charcoal">
                      {selectedCertificateOrder.painting?.artist}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-studio-muted text-xs uppercase">Curatorial Medium:</span>
                    <span className="col-span-2 text-xs text-studio-muted">
                      {selectedCertificateOrder.painting?.description}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-studio-muted text-xs uppercase">Registered Patron:</span>
                    <span className="col-span-2 font-medium text-studio-charcoal">
                      {user?.name} ({user?.email})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-studio-muted text-xs uppercase">Acquisition Value:</span>
                    <span className="col-span-2 font-serif font-bold text-studio-terracotta">
                      ₹{selectedCertificateOrder.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-studio-muted text-xs uppercase">Archive Registry ID:</span>
                    <span className="col-span-2 font-mono text-[11px] text-studio-muted">
                      {selectedCertificateOrder.id}
                    </span>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="flex items-end justify-between pt-6 border-t border-amber-900/20 mt-6">
                  <div className="text-left space-y-1">
                    <div className="w-24 border-b border-stone-400 mb-1" />
                    <span className="text-[10px] uppercase font-bold text-studio-muted block">
                      Curatorial Seal
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Date: {new Date(selectedCertificateOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-800/40 flex items-center justify-center text-center p-1">
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-amber-900">
                      STUDIO VERIFIED ORIGINAL
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="w-24 border-b border-stone-400 mb-1 ml-auto" />
                    <span className="text-[10px] uppercase font-bold text-studio-muted block">
                      Atelier Director
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Kalāranya Studio
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-studio-border">
                <button
                  type="button"
                  onClick={() => setSelectedCertificateOrder(null)}
                  className="px-4 py-2 rounded-lg border border-studio-border text-xs font-medium text-studio-charcoal hover:bg-studio-ivory transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-studio-charcoal text-white text-xs font-medium hover:bg-black transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
