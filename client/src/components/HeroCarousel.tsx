import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Award, ShieldCheck, Truck, Sparkles, Eye } from 'lucide-react';

interface FeaturedArt {
  id: string;
  title: string;
  artist: string;
  style: string;
  price: number;
  imageUrl: string;
  dimensions: string;
  status: 'available' | 'sold';
}

interface ExhibitionSlide {
  id: number;
  badge: string;
  title: string;
  accent: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  artworks: FeaturedArt[];
}

const EXHIBITION_SLIDES: ExhibitionSlide[] = [
  {
    id: 1,
    badge: 'Curated Heritage Exhibition • 100% Original Art',
    title: 'Timeless art forms handcrafted for the',
    accent: 'mindful sanctuary',
    subtitle:
      'Original Indian masterpieces created with natural pigments, gold leaf, and handmade tussar. Each piece is singular and can only be acquired once.',
    primaryCtaText: 'Explore Paintings',
    primaryCtaLink: '/paintings',
    secondaryCtaText: 'Book Wall Mural',
    secondaryCtaLink: '/book-wall',
    artworks: [
      {
        id: 'p-001',
        title: 'Madhubani Peacock Garden',
        artist: 'Meera Kumari',
        style: 'Madhubani Folk',
        price: 6500,
        imageUrl: '/images/p-001.jpg',
        dimensions: '45 x 60 cm',
        status: 'available'
      },
      {
        id: 'p-003',
        title: 'Tanjore Lakshmi with Gold Leaf',
        artist: 'Revathi Iyer',
        style: 'Tanjore Sacred',
        price: 24500,
        imageUrl: '/images/p-003.jpg',
        dimensions: '60 x 75 cm',
        status: 'available'
      },
      {
        id: 'p-005',
        title: 'Kalamkari Tree of Life',
        artist: 'Padma Reddy',
        style: 'Kalamkari Vegetable Dyes',
        price: 9200,
        imageUrl: '/images/p-005.jpg',
        dimensions: '60 x 90 cm',
        status: 'available'
      }
    ]
  },
  {
    id: 2,
    badge: 'Architectural Murals & Large-Format Panels',
    title: 'Bespoke hand-painted murals for your',
    accent: 'feature walls',
    subtitle:
      'Large-format temple scrolls, river ghat panoramas, and custom wall paintings. Flat architectural pricing at ₹150 / sq ft with scheduled studio artisan bookings.',
    primaryCtaText: 'Book Wall Mural',
    primaryCtaLink: '/book-wall',
    secondaryCtaText: 'View All Paintings',
    secondaryCtaLink: '/paintings',
    artworks: [
      {
        id: 'p-012',
        title: 'Varanasi Evening Aarti at the Ghats',
        artist: 'Arjun Mishra',
        style: 'Grand Oil Panorama',
        price: 25000,
        imageUrl: '/images/p-012.jpg',
        dimensions: '90 x 120 cm',
        status: 'available'
      },
      {
        id: 'p-004',
        title: 'Pattachitra Dashavatara Panel',
        artist: 'Bikram Swain',
        style: 'Pattachitra Scroll',
        price: 12000,
        imageUrl: '/images/p-004.jpg',
        dimensions: '40 x 120 cm',
        status: 'sold'
      }
    ]
  },
  {
    id: 3,
    badge: 'Indigenous Folk Masters & Atelier Craft',
    title: 'Centuries of indigenous Indian tribal',
    accent: 'craft and wisdom',
    subtitle:
      'Gond dotwork, Kerala temple murals, and Warli rice-paste storytelling. Hand-thrown terracotta pottery and kiln-fired glazes custom crafted upon request.',
    primaryCtaText: 'Commission Pottery',
    primaryCtaLink: '/custom-pottery',
    secondaryCtaText: 'Explore Collection',
    secondaryCtaLink: '/paintings',
    artworks: [
      {
        id: 'p-006',
        title: 'Gond Forest Spirits',
        artist: 'Mohan Markam',
        style: 'Gond Fine Dots',
        price: 7300,
        imageUrl: '/images/p-006.jpg',
        dimensions: '50 x 70 cm',
        status: 'available'
      },
      {
        id: 'p-011',
        title: 'Kathakali Face Kerala Mural',
        artist: 'Sreeja Nair',
        style: 'Kerala Temple Mural',
        price: 11000,
        imageUrl: '/images/p-011.jpg',
        dimensions: '40 x 50 cm',
        status: 'available'
      },
      {
        id: 'p-002',
        title: 'Warli Village Scene',
        artist: 'Anil Gavit',
        style: 'Warli Rice Paste',
        price: 1800,
        imageUrl: '/images/p-002.jpg',
        dimensions: '25 x 25 cm',
        status: 'available'
      }
    ]
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % EXHIBITION_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + EXHIBITION_SLIDES.length) % EXHIBITION_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = EXHIBITION_SLIDES[currentSlide];

  return (
    <div
      className="relative w-full bg-studio-ivory"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Gallery Wall Stage */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16 border-b border-studio-border/70 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Narrative */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-studio-border text-xs font-medium tracking-wide text-studio-charcoal shadow-sm">
              <span className="w-2 h-2 rounded-full bg-studio-terracotta animate-pulse" />
              {slide.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-studio-charcoal leading-[1.1] tracking-tight">
              {slide.title}{' '}
              <span className="italic font-normal text-studio-terracotta">
                {slide.accent}
              </span>
              .
            </h1>

            <p className="text-sm sm:text-base text-studio-muted font-light leading-relaxed max-w-2xl mx-auto">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to={slide.primaryCtaText.includes('Mural') ? '/book-wall' : slide.primaryCtaText.includes('Pottery') ? '/custom-pottery' : '/paintings'}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-studio-terracotta text-white font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm text-sm"
              >
                {slide.primaryCtaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={slide.secondaryCtaLink}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white border border-studio-border text-studio-charcoal font-medium hover:bg-studio-sand transition-colors shadow-sm text-sm"
              >
                {slide.secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* Staged Gallery Wall of Real Seed Paintings */}
          <div className="relative mt-8">
            {/* Gallery Frame Layout */}
            <div className={`grid gap-6 sm:gap-8 items-end justify-center ${
              slide.artworks.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto'
            }`}>
              {slide.artworks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => navigate(`/paintings/${art.id}`)}
                  className="group cursor-pointer flex flex-col items-center transition-transform duration-300 hover:-translate-y-1.5"
                >
                  {/* Museum Wall Frame */}
                  <div className="relative p-3 sm:p-4 bg-white rounded shadow-xl border border-stone-300 ring-4 ring-[#22201E] ring-offset-2 ring-offset-stone-200 transition-all duration-300 group-hover:ring-studio-terracotta group-hover:shadow-2xl w-full">
                    <div className="relative overflow-hidden bg-stone-100 aspect-[4/5] sm:aspect-[3/4]">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-white/95 text-studio-charcoal text-xs font-medium shadow-lg flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-studio-terracotta" />
                          View Original
                        </span>
                      </div>
                      {art.status === 'sold' && (
                        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded bg-red-800 text-white text-[10px] font-bold tracking-wider uppercase shadow">
                          Sold Out
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brass Exhibition Plaque */}
                  <div className="mt-3.5 text-center px-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-studio-muted block">
                      {art.style} • {art.dimensions}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-studio-charcoal group-hover:text-studio-terracotta transition-colors line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      by <span className="font-medium text-studio-charcoal">{art.artist}</span>
                    </p>
                    <p className="text-xs font-semibold text-studio-terracotta mt-1">
                      ₹{art.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Left & Right Arrow Controls */}
            <button
              onClick={prevSlide}
              aria-label="Previous exhibition"
              className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-studio-charcoal border border-studio-border shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next exhibition"
              className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-studio-charcoal border border-studio-border shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Exhibition Dots Navigation */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {EXHIBITION_SLIDES.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to exhibition ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-7 h-2 bg-studio-terracotta shadow-sm'
                      : 'w-2 h-2 bg-studio-border hover:bg-studio-muted'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges Strip (Warm Studio Theme) */}
      <div className="bg-white border-b border-studio-border py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-studio-charcoal">
            {/* Badge 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">100% Original Artwork</h4>
                <p className="text-[11px] text-studio-muted">Every piece singular & signed</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">Certificate of Authenticity</h4>
                <p className="text-[11px] text-studio-muted">Official physical studio document</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">Pan-India Insured Transit</h4>
                <p className="text-[11px] text-studio-muted">Custom wooden crate packing</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">Flat ₹150 / sq ft Murals</h4>
                <p className="text-[11px] text-studio-muted">Transparent artisan rates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};