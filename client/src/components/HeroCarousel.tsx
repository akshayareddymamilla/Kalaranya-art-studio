import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Award, Truck, ShieldCheck, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  titlePrefix: string;
  accentText: string;
  titleSuffix: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  badgeCategory: string;
  badgeDetail: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'Original Contemporary Indian Art',
    titlePrefix: 'Timeless art forms handcrafted for the',
    accentText: 'mindful sanctuary',
    titleSuffix: '.',
    description:
      'Kalāranya Studio unites traditional heritage with contemporary living. Each painting is strictly one-of-a-kind and accompanied by a verified Certificate of Authenticity.',
    primaryCtaText: 'Explore Paintings',
    primaryCtaLink: '/paintings',
    secondaryCtaText: 'Book Wall Mural',
    secondaryCtaLink: '/book-wall',
    image: '/images/hero-1.jpg',
    badgeCategory: 'Fine Art Living Collection',
    badgeDetail: 'Authentic Folk & Contemporary Masters • Bengaluru Atelier'
  },
  {
    id: 2,
    tag: 'Architectural Wall Murals',
    titlePrefix: 'Transform your living space with bespoke',
    accentText: 'hand-painted murals',
    titleSuffix: '.',
    description:
      'Large-format murals hand-painted directly onto your residential or commercial walls. Transparent flat pricing at ₹150 / sq ft with advance artisan scheduling.',
    primaryCtaText: 'Book Wall Mural',
    primaryCtaLink: '/book-wall',
    secondaryCtaText: 'Explore Paintings',
    secondaryCtaLink: '/paintings',
    image: '/images/hero-2.jpg',
    badgeCategory: 'Architectural Murals',
    badgeDetail: 'Custom On-Site Artistry • Flat ₹150 / sq ft'
  },
  {
    id: 3,
    tag: 'Bespoke Wheel-Thrown Ceramics',
    titlePrefix: 'Individually thrown terracotta pottery with',
    accentText: 'mineral earth glazes',
    titleSuffix: '.',
    description:
      'Custom kulhads, surahis, matkas, and indoor planters wheel-thrown by heritage potters and dipped in authentic mineral glazes including Kumkum Red and Neel Blue.',
    primaryCtaText: 'Commission Pottery',
    primaryCtaLink: '/custom-pottery',
    secondaryCtaText: 'Explore Paintings',
    secondaryCtaLink: '/paintings',
    image: '/images/hero-3.jpg',
    badgeCategory: 'Master Artisan Ceramics',
    badgeDetail: 'Kiln-Fired Terracotta • Custom Shapes & Glazes'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative overflow-hidden w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Viewport */}
      <div className="relative h-[540px] sm:h-[580px] lg:h-[620px] w-full bg-studio-charcoal">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Background In-Situ Image */}
              <img
                src={slide.image}
                alt={slide.tag}
                className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
              />

              {/* Sophisticated Luxury Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl text-white space-y-5">
                    {/* Tag / Category Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wider uppercase text-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      {slide.tag}
                    </div>

                    {/* Headline in Cormorant Garamond */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white leading-[1.08] tracking-tight drop-shadow-md">
                      {slide.titlePrefix}{' '}
                      <span className="italic font-normal text-amber-300">
                        {slide.accentText}
                      </span>
                      {slide.titleSuffix}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base lg:text-lg text-stone-200 leading-relaxed font-light max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                      <Link
                        to={slide.primaryCtaLink}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-studio-terracotta text-white font-medium hover:bg-studio-terracotta-hover transition-colors shadow-lg hover:shadow-xl text-sm"
                      >
                        {slide.primaryCtaText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to={slide.secondaryCtaLink}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/90 hover:bg-white text-studio-charcoal font-medium transition-colors shadow-lg text-sm backdrop-blur-sm"
                      >
                        {slide.secondaryCtaText}
                      </Link>
                    </div>

                    {/* In-Situ Art Room Tag */}
                    <div className="pt-3 hidden sm:flex items-center gap-2 text-xs text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-amber-300">
                        IN SITU
                      </span>
                      <span>{slide.badgeCategory} • {slide.badgeDetail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Pagination Indicator Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {SLIDES.map((_, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? 'w-8 h-2.5 bg-amber-400 shadow-md'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Trust Badges Bar (Inspired by Canvo reference) */}
      <div className="bg-white border-b border-studio-border py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-studio-charcoal">
            {/* Badge 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">100% Original Artwork</h4>
                <p className="text-[11px] text-studio-muted">Every piece signed & unique</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">Certificate of Authenticity</h4>
                <p className="text-[11px] text-studio-muted">Official studio documentation</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">Pan-India Insured Transit</h4>
                <p className="text-[11px] text-studio-muted">Custom wooden crate packing</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
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