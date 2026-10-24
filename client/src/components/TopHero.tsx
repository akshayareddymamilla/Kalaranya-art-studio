import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';

interface HeroSlideData {
  id: number;
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  accentText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  altText: string;
  bgColor: string;
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 1,
    kicker: 'ORIGINAL INDIAN ART',
    titleLine1: 'Timeless art forms',
    titleLine2: 'handcrafted for the',
    accentText: 'mindful sanctuary.',
    subtitle:
      'Kalāranya Studio unites traditional heritage with contemporary living. Each painting is strictly one-of-a-kind and accompanied by a verified Certificate of Authenticity.',
    primaryCtaText: 'Explore Paintings',
    primaryCtaLink: '/paintings',
    secondaryCtaText: 'Book Wall Consultation',
    secondaryCtaLink: '/book-wall',
    image: '/images/hero-room.jpg',
    altText: 'Kalāranya In-Situ Fine Art Living Room with Traditional Lotus Painting',
    bgColor: '#EFEAE0'
  },
  {
    id: 2,
    kicker: 'ORIGINAL INDIAN ART',
    titleLine1: 'Timeless Indian art',
    titleLine2: 'for',
    accentText: 'modern spaces.',
    subtitle:
      'Explore our curated collection of authentic Indian paintings — from traditional art forms to contemporary interpretations. Each piece tells a story, rooted in culture and crafted with passion.',
    primaryCtaText: 'Shop Paintings',
    primaryCtaLink: '/paintings',
    secondaryCtaText: 'View Collection',
    secondaryCtaLink: '/paintings',
    image: '/images/hero-room-2.jpg',
    altText: 'Kalāranya Indian Heritage Elephant Tapestry in Sunlit Living Room with Urli Table',
    bgColor: '#EFE7DA'
  },
  {
    id: 3,
    kicker: 'WALL ART & MURALS',
    titleLine1: 'Bring Indian artistry',
    titleLine2: 'into',
    accentText: 'your spaces.',
    subtitle:
      'From hand-painted murals to bespoke wall art, we create meaningful pieces that transform your home, office or commercial space into a work of art.',
    primaryCtaText: 'Explore Wall Art',
    primaryCtaLink: '/book-wall',
    secondaryCtaText: 'Get Custom Quote',
    secondaryCtaLink: '/book-wall',
    image: '/images/hero-room-3.jpg',
    altText: 'Architectural Tree of Life Peacock Wall Mural with Traditional Indian Archway',
    bgColor: '#EFE4D6'
  }
];

export const TopHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[540px] w-full bg-[#EFEAE0]">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{ backgroundColor: slide.bgColor }}
            >
              <div className="max-w-[1440px] mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-stretch min-h-[480px] sm:min-h-[520px] lg:min-h-[540px]">
                  
                  {/* Left Column: Editorial Narrative */}
                  <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center px-6 sm:px-10 lg:pl-14 lg:pr-8 py-8 lg:py-12 z-10">
                    {/* Kicker */}
                    <div className="flex items-center gap-3 text-xs tracking-[0.22em] font-medium uppercase text-[#A64A26] mb-3 sm:mb-4">
                      <span className="w-6 h-[1.5px] bg-[#A64A26]" />
                      <span>{slide.kicker}</span>
                      <span className="w-6 h-[1.5px] bg-[#A64A26]" />
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-serif font-normal text-[#2A2421] leading-[1.12] tracking-tight mb-4">
                      {slide.titleLine1}<br />
                      {slide.titleLine2}{' '}
                      <span className="italic font-normal text-[#A64A26] font-serif">
                        {slide.accentText}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm lg:text-[15px] text-stone-600 leading-relaxed font-light max-w-lg mb-6 sm:mb-8">
                      {slide.subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3.5">
                      <Link
                        to={slide.primaryCtaLink}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#A64A26] text-white font-medium hover:bg-[#8F3E1E] transition-all duration-200 shadow-sm text-xs sm:text-sm"
                      >
                        {slide.primaryCtaText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to={slide.secondaryCtaLink}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#E8E2D6] border border-[#BFB4A3] text-[#2A2421] font-medium hover:bg-[#DFD8CC] transition-all duration-200 shadow-sm text-xs sm:text-sm"
                      >
                        {slide.secondaryCtaText}
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: In-Situ Staged Art Wall Image */}
                  <div className="lg:col-span-7 xl:col-span-7 relative min-h-[300px] sm:min-h-[360px] lg:min-h-[540px] overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.altText}
                      className="w-full h-full object-cover object-center lg:object-left"
                    />
                    {/* Subtle left gradient blend for seamless continuity */}
                    <div
                      className="hidden lg:block absolute inset-y-0 left-0 w-16 pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, ${slide.bgColor}, transparent)`
                      }}
                    />
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous hero slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md border border-stone-200/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next hero slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md border border-stone-200/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Pagination Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? 'w-7 h-2 bg-[#A64A26] shadow-sm'
                    : 'w-2 h-2 bg-stone-400/60 hover:bg-stone-600'
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