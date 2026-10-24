import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Painting } from '../types';
import { paintingService } from '../services/painting.service';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { TopHero } from '../components/TopHero';
import { ArrowRight, Check } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [featuredPaintings, setFeaturedPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const data = await paintingService.getAll();
        setFeaturedPaintings(data.slice(0, 4));
      } catch (err: any) {
        setError(err.message || 'Unable to load featured artwork');
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial In-Situ Top Hero (Matching Reference Design) */}
      <TopHero />

      {/* The 3 Studio Pillars (Elevated Architectural Editorial Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="flex items-center justify-center gap-3 text-xs tracking-[0.22em] font-medium uppercase text-[#A64A26]">
              <span className="w-8 h-[1.5px] bg-[#A64A26]" />
              <span>STUDIO DISCIPLINES</span>
              <span className="w-8 h-[1.5px] bg-[#A64A26]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-studio-charcoal tracking-tight">
              Three Disciplines, <span className="italic font-normal text-studio-terracotta">One Atelier.</span>
            </h2>
            <p className="text-sm sm:text-base text-studio-muted font-light leading-relaxed max-w-2xl mx-auto">
              Every creation is governed by strict craftsmanship, transparent pricing, and authenticity guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Discipline 1: Paintings */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-studio-border shadow-sm hover:shadow-xl hover:border-studio-terracotta/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Visual Header Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-studio-sand">
                  <img
                    src="/images/p-001.jpg"
                    alt="One-of-a-Kind Paintings"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-studio-charcoal font-semibold shadow-sm">
                    100% Original Artwork
                  </div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-medium block">Singular Acquisition</span>
                    <h4 className="font-serif text-lg font-semibold">Fine Art Paintings</h4>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <p className="text-sm text-studio-muted leading-relaxed font-light">
                    Authentic Madhubani, Warli, Tanjore, Pattachitra, and Gond paintings. Each piece is unique and can be acquired only once.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-studio-border/60">
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Singular acquisition (acquired only once)</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Physical Certificate of Authenticity</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Natural pigments on tussar & handmade paper</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-6 sm:px-7 pb-6 pt-2">
                <Link
                  to="/paintings"
                  className="w-full py-3 px-4 rounded-lg bg-studio-sand/80 border border-studio-border text-xs font-semibold text-studio-charcoal group-hover:bg-studio-terracotta group-hover:text-white group-hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  Browse Catalogue
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Discipline 2: Wall Murals */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-studio-border shadow-sm hover:shadow-xl hover:border-studio-terracotta/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Visual Header Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-studio-sand">
                  <img
                    src="/images/hero-room-3.jpg"
                    alt="Architectural Wall Murals"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-studio-charcoal font-semibold shadow-sm">
                    Flat ₹150 / sq ft
                  </div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-medium block">On-Site Artistry</span>
                    <h4 className="font-serif text-lg font-semibold">Architectural Murals</h4>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <p className="text-sm text-studio-muted leading-relaxed font-light">
                    Custom hand-painted murals for residential and commercial walls. Transparent flat rate of ₹150 / sq ft, with scheduled booking 7 to 90 days out.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-studio-border/60">
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Transparent flat rate of ₹150 / sq ft</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Advance calendar booking (7 to 90 days)</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Living room, courtyard & feature walls</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-6 sm:px-7 pb-6 pt-2">
                <Link
                  to="/book-wall"
                  className="w-full py-3 px-4 rounded-lg bg-studio-sand/80 border border-studio-border text-xs font-semibold text-studio-charcoal group-hover:bg-studio-terracotta group-hover:text-white group-hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  Reserve a Date
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Discipline 3: Pottery */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-studio-border shadow-sm hover:shadow-xl hover:border-studio-terracotta/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Visual Header Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-studio-sand">
                  <img
                    src="/images/hero-room-2.jpg"
                    alt="Custom Glazed Pottery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-studio-charcoal font-semibold shadow-sm">
                    6 Mineral Glazes
                  </div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-medium block">Heritage Craft</span>
                    <h4 className="font-serif text-lg font-semibold">Custom Glazed Pottery</h4>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <p className="text-sm text-studio-muted leading-relaxed font-light">
                    Bespoke terracotta kulhads, surahis, matkas, and planters dipped in traditional glazes like Kumkum Red and Haldi Yellow.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-studio-border/60">
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>5 heritage terracotta vessel shapes</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Kumkum Red, Haldi Yellow & Neel glazes</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-studio-charcoal">
                      <Check className="w-3.5 h-3.5 text-studio-terracotta shrink-0" />
                      <span>Direct patron-to-artisan request tracking</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-6 sm:px-7 pb-6 pt-2">
                <Link
                  to="/custom-pottery"
                  className="w-full py-3 px-4 rounded-lg bg-studio-sand/80 border border-studio-border text-xs font-semibold text-studio-charcoal group-hover:bg-studio-terracotta group-hover:text-white group-hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  Commission Pottery
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-studio-terracotta block">
              Curated Selection
            </span>
            <h2 className="text-3xl font-serif font-bold text-studio-charcoal mt-1">Available Paintings</h2>
          </div>
          <Link
            to="/paintings"
            className="text-sm font-medium text-studio-charcoal hover:text-studio-terracotta flex items-center gap-1"
          >
            View All ({featuredPaintings.length}+) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Fetching gallery highlights..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPaintings.map((painting) => (
              <div
                key={painting.id}
                className="group bg-white rounded-xl overflow-hidden border border-studio-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-studio-sand overflow-hidden">
                  <img
                    src={`/${painting.imageUrl}`}
                    alt={painting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={painting.status} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-studio-muted">{painting.artist}</span>
                    <h3 className="font-serif text-base font-semibold text-studio-charcoal mt-1 line-clamp-1">
                      {painting.title}
                    </h3>
                    <p className="text-xs text-studio-muted mt-2 line-clamp-2 leading-relaxed">
                      {painting.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-studio-border/60 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-studio-muted block">Price</span>
                      <span className="font-serif text-lg font-bold text-studio-charcoal">
                        ₹{painting.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      to={`/paintings/${painting.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-studio-sand border border-studio-border text-xs font-medium text-studio-charcoal group-hover:bg-studio-terracotta group-hover:text-white group-hover:border-transparent transition-colors"
                    >
                      View Piece
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
