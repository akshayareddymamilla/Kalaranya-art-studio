import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Sparkles, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideData {
  id: number;
  kicker: string;
  headlinePrefix: string;
  headlineAccent: string;
  headlineSuffix?: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
}

const TOP_SLIDES: SlideData[] = [
  {
    id: 1,
    kicker: 'ORIGINAL INDIAN ART',
    headlinePrefix: 'Timeless art forms\nhandcrafted for the',
    headlineAccent: 'mindful sanctuary.',
    subtitle:
      'Kalāranya Studio unites traditional heritage with contemporary living. Each painting is strictly one-of-a-kind and accompanied by a verified Certificate of Authenticity.',
    primaryCtaText: 'Explore Paintings',
    primaryCtaLink: '/paintings',
    secondaryCtaText: 'Book Wall Consultation',
    secondaryCtaLink: '/book-wall',
    image: '/images/hero-room-1.jpg',
    imageAlt: 'Kalāranya In-Situ Fine Art Living Room'
  },
  {
    id: 2,
    kicker: 'ORIGINAL INDIAN ART',
    headlinePrefix: 'Timeless Indian art\nfor',
    headlineAccent: 'modern spaces.',
    subtitle:
      'Explore our curated collection of authentic Indian paintings — from traditional art forms to contemporary interpretations. Each piece tells a story, rooted in culture and crafted with passion.',
    primaryCtaText: 'Shop Paintings',
    primaryCtaLink: '/paintings',
    secondaryCtaText: 'View Collection',
    secondaryCtaLink: '/paintings',
    image: '/images/hero-room-2.jpg',
    imageAlt: 'Royal Elephant Folk Painting and Indian Living Space'
  },
  {
    id: 3,
    kicker: 'WALL ART & MURALS',
    headlinePrefix: 'Bring Indian artistry\ninto',
    headlineAccent: 'your spaces.',
    subtitle:
      'From hand-painted murals to bespoke wall art, we create meaningful pieces that transform your home, office or commercial space into a work of art.',
    primaryCtaText: 'Explore Wall Art',
    primaryCtaLink: '/book-wall',
    secondaryCtaText: 'Get Custom Quote',
    secondaryCtaLink: '/book-wall',
    image: '/images/hero-room-3.jpg',
    imageAlt: 'Hand-Painted Courtyard Peacocks and Tree of Life Mural'
  }
];

export const TopHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % TOP_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + TOP_SLIDES.length) % TOP_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = TOP_SLIDES[currentSlide];

  return (
    <div
      className="relative w-full bg-[#EFEAE0]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Split Hero Viewport */}
      <div className="relative max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[530px] items-stretch">
          
          {/* Left Column: Editorial Narrative with Fade Transitions */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center px-6 sm:px-10 lg:pl-14 lg:pr-8 py-10 lg:py-14 z-10 transition-opacity duration-700 ease-in-out">
            {/* Kicker */}
            <div className="flex items-center gap-3 text-xs tracking-[0.22em] font-medium uppercase text-[#A64A26] mb-4">
              <span className="w-6 h-[1.5px] bg-[#A64A26]" />
              <span>{slide.kicker}</span>
              <span className="w-6 h-[1.5px] bg-[#A64A26]" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-serif font-normal text-[#2A2421] leading-[1.12] tracking-tight mb-5 whitespace-pre-line min-h-[120px] sm:min-h-[140px] lg:min-h-[170px] flex flex-col justify-center">
              <span>
                {slide.headlinePrefix}{' '}
                <span className="italic font-normal text-[#A64A26] font-serif">
                  {slide.headlineAccent}
                </span>
                {slide.headlineSuffix || ''}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light max-w-lg mb-8 min-h-[72px] sm:min-h-[64px] flex items-center">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={slide.primaryCtaLink}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-[#A64A26] text-white font-medium hover:bg-[#8F3E1E] transition-all duration-200 shadow-sm text-sm"
              >
                {slide.primaryCtaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={slide.secondaryCtaLink}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#E8E2D6] border border-[#BFB4A3] text-[#2A2421] font-medium hover:bg-[#DFD8CC] transition-all duration-200 shadow-sm text-sm"
              >
                {slide.secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* Right Column: In-Situ Staged Art Wall Image Stack */}
          <div className="lg:col-span-7 xl:col-span-7 relative min-h-[360px] lg:min-h-[530px] overflow-hidden">
            {TOP_SLIDES.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    className="w-full h-full object-cover object-center lg:object-left"
                  />
                  {/* Subtle left gradient blend for seamless continuity */}
                  <div className="hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#EFEAE0] to-transparent pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2A2421] border border-[#BFB4A3]/50 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2A2421] border border-[#BFB4A3]/50 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {TOP_SLIDES.map((_, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? 'w-7 h-2 bg-[#A64A26] shadow-sm'
                    : 'w-2 h-2 bg-stone-400/60 hover:bg-stone-500'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Trust Badges Strip (Exact Match to Reference Screenshot) */}
      <div className="bg-[#FAF7F2] border-y border-[#E5DFD4] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-[#2A2421]">
            
            {/* Badge 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full border border-[#A64A26] bg-[#FAF4ED] text-[#A64A26] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold tracking-tight">100% Original Art</h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Handpicked by our experts</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full border border-[#A64A26] bg-[#FAF4ED] text-[#A64A26] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold tracking-tight">Authenticity Certificate</h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">With every painting</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full border border-[#A64A26] bg-[#FAF4ED] text-[#A64A26] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold tracking-tight">Safe & Secure Delivery</h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Across India</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full border border-[#A64A26] bg-[#FAF4ED] text-[#A64A26] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold tracking-tight">Support Indian Artists</h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Preserve our heritage</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};