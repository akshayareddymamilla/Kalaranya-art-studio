import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/booking.service';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { Calendar, Ruler, MapPin, Calculator, ShieldAlert, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const WallBookingForm: React.FC = () => {
  const { isAuthenticated, isStudioAdmin } = useAuth();
  const navigate = useNavigate();

  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(150);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [date, setDate] = useState<string>('');
  const [wallSize, setWallSize] = useState<number>(50);
  const [address, setAddress] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper local date formatter (avoids UTC timezone day-shift bug)
  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper date boundaries (7 days to 90 days from today)
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatLocalDate(d);
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return formatLocalDate(d);
  };

  const minDate = getMinDate();
  const maxDate = getMaxDate();

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);
        const data = await bookingService.getAvailability();
        setOccupiedDates(data.occupiedDates || []);
        if (data.ratePerSqFt) setRatePerSqFt(data.ratePerSqFt);
      } catch (err: any) {
        console.error('Failed to load availability:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, []);

  const calculatedPrice = wallSize * ratePerSqFt;
  const isDateOccupied = occupiedDates.includes(date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/book-wall');
      return;
    }
    if (isStudioAdmin) {
      setError('Studio admins cannot create customer bookings. Please log in as a customer.');
      return;
    }

    if (isDateOccupied) {
      setError(`The date ${date} is already booked. Please choose another available date.`);
      return;
    }

    if (wallSize < 10 || wallSize > 500) {
      setError('Wall size must be between 10 and 500 square feet.');
      return;
    }

    if (!address.trim()) {
      setError('Site address is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await bookingService.create({
        date,
        wallSize: Number(wallSize),
        address,
      });

      setSuccessMessage(`Wall painting booking requested for ${date}! The studio will review and confirm.`);
      setOccupiedDates((prev) => [...prev, date]);
      setDate('');
      setAddress('');
    } catch (err: any) {
      // Clear refusal message if date was taken concurrently
      setError(err.message || 'Date just taken by another booking. Please select another date.');
      // Refresh availability
      const updated = await bookingService.getAvailability();
      setOccupiedDates(updated.occupiedDates || []);
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
          Architectural Murals
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-studio-charcoal mt-1">
          Book a Hand-Painted Wall Mural
        </h1>
        <p className="text-sm text-studio-muted mt-2 max-w-2xl leading-relaxed">
          Commission our master artisans to paint an original mural directly onto your residential or commercial wall.
          Schedule a date between 7 and 90 days out. Transparent studio rate: <strong>₹{ratePerSqFt} per sq ft</strong>.
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
                View your booking in My Dashboard →
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
        <LoadingState message="Checking studio calendar availability..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-studio-border p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                  1. Select Scheduled Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-studio-ivory ${
                      isDateOccupied
                        ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
                        : 'border-studio-border focus:ring-studio-terracotta/20 focus:border-studio-terracotta text-studio-charcoal'
                    }`}
                  />
                </div>
                {isDateOccupied ? (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> This date is already booked by another patron.
                  </p>
                ) : (
                  <p className="text-xs text-studio-muted">
                    Booking Window: {minDate} to {maxDate} (7–90 days ahead)
                  </p>
                )}
                {occupiedDates.length > 0 && (
                  <div className="pt-1.5">
                    <span className="text-[11px] text-studio-muted font-medium block mb-1">
                      Already Booked Dates (Unavailable):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {occupiedDates.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 border border-rose-200 line-through"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wall Size Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                    2. Wall Surface Area
                  </label>
                  <span className="text-xs font-mono font-bold text-studio-terracotta bg-studio-sand px-2 py-0.5 rounded">
                    {wallSize} sq ft
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-4 h-4 text-studio-muted" />
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={wallSize}
                    onChange={(e) => setWallSize(Number(e.target.value))}
                    className="w-full accent-studio-terracotta cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-studio-muted">
                  <span>Min: 10 sq ft</span>
                  <span>Max: 500 sq ft</span>
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-charcoal">
                  3. Site Address & City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-studio-muted absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={3}
                    placeholder="Enter full premises address, building, floor, landmark, and contact details..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-ivory text-studio-charcoal focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isDateOccupied || !date}
                className="w-full py-3 px-6 rounded-xl bg-studio-terracotta text-white font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Submit Booking Request (₹{calculatedPrice.toLocaleString('en-IN')})
              </button>
            </form>
          </div>

          {/* Price Breakdown & Studio Policies Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-studio-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-studio-terracotta font-serif font-bold text-lg">
                <Calculator className="w-5 h-5" />
                <span>Price Estimation</span>
              </div>

              <div className="space-y-3 text-sm divide-y divide-studio-border/60">
                <div className="flex justify-between pt-1">
                  <span className="text-studio-muted">Wall Dimensions</span>
                  <span className="font-medium text-studio-charcoal">{wallSize} sq ft</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-studio-muted">Studio Rate</span>
                  <span className="font-medium text-studio-charcoal">₹{ratePerSqFt} / sq ft</span>
                </div>
                <div className="flex justify-between pt-3 text-base">
                  <span className="font-semibold text-studio-charcoal">Total Investment</span>
                  <span className="font-serif font-bold text-xl text-studio-terracotta">
                    ₹{calculatedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-studio-ivory rounded-2xl border border-studio-border p-6 space-y-3 text-xs text-studio-muted">
              <h4 className="font-semibold uppercase tracking-wider text-studio-charcoal">
                Studio Policies & Guarantees
              </h4>
              <ul className="space-y-2 list-disc list-inside leading-relaxed">
                <li><strong>Exclusivity:</strong> Only one booking is accepted per calendar date.</li>
                <li><strong>Review:</strong> The studio will confirm or decline the request within 48 hours.</li>
                <li><strong>Cancellation Cutoff:</strong> Customers may cancel their booking until <strong>3 days</strong> prior to the date. Within 3 days, cancellation is locked.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
