import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';

interface BannerSlide {
  id: number;
  image: string;
  alt: string;
  primaryTitle: string;
  primaryLink: string;
  secondaryTitle: string;
  secondaryLink: string;
  primaryArea: { left: string; top: string; width: string; height: string };
  secondaryArea: { left: string; top: string; width: string; height: string };
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: '/images/hero-banner-1-hd.jpg',
    alt: 'Kalāranya — Timeless art forms handcrafted for the mindful sanctuary',
    primaryTitle: 'Explore Paintings',
    primaryLink: '/paintings',
    secondaryTitle: 'Book Wall Consultation',
    secondaryLink: '/book-wall',
    primaryArea: { left: '5.5%', top: '73.5%', width: '13.5%', height: '11.5%' },
    secondaryArea: { left: '20%', top: '73.5%', width: '16.5%', height: '11.5%' }
  },
  {
    id: 2,
    image: '/images/hero-banner-2-hd.jpg',
    alt: 'Kalāranya — Timeless Indian art for modern spaces',
    primaryTitle: 'Shop Paintings',
    primaryLink: '/paintings',
    secondaryTitle: 'View Collection',
    secondaryLink: '/paintings',
    primaryArea: { left: '9.8%', top: '84.5%', width: '10.8%', height: '11.5%' },
    secondaryArea: { left: '21.8%', top: '84.5%', width: '10.2%', height: '11.5%' }
  },
  {
    id: 3,
    image: '/images/hero-banner-3-hd.jpg',
    alt: 'Kalāranya — Bring Indian artistry into your spaces',
    primaryTitle: 'Explore Wall Art',
    primaryLink: '/book-wall',
    secondaryTitle: 'Get Custom Quote',
    secondaryLink: '/book-wall',
    primaryArea: { left: '9.8%', top: '84.5%', width: '10.8%', height: '11.5%' },
    secondaryArea: { left: '21.8%', top: '84.5%', width: '10.2%', height: '11.5%' }
  }
];

export const TopHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = BANNER_SLIDES[currentSlide];

  return (
    <div
      className="relative w-full bg-[#EFEAE0] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full Uncropped High-Definition Banner Viewport */}
      <div className="relative w-full max-w-[1920px] mx-auto overflow-hidden">
        {/* Render active slide with zero cropping in full aspect ratio */}
        <div className="relative w-full">
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-auto block object-contain transition-opacity duration-500"
            style={{ imageRendering: 'auto' }}
          />

          {/* Interactive Clickable Hotspot for Primary Button */}
          <Link
            to={slide.primaryLink}
            title={slide.primaryTitle}
            className="absolute z-20 rounded-md transition-all duration-200 hover:ring-2 hover:ring-[#A64A26] hover:bg-black/5"
            style={{
              left: slide.primaryArea.left,
              top: slide.primaryArea.top,
              width: slide.primaryArea.width,
              height: slide.primaryArea.height
            }}
          />

          {/* Interactive Clickable Hotspot for Secondary Button */}
          <Link
            to={slide.secondaryLink}
            title={slide.secondaryTitle}
            className="absolute z-20 rounded-md transition-all duration-200 hover:ring-2 hover:ring-[#A64A26] hover:bg-black/5"
            style={{
              left: slide.secondaryArea.left,
              top: slide.secondaryArea.top,
              width: slide.secondaryArea.width,
              height: slide.secondaryArea.height
            }}
          />
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous hero slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-xl border border-stone-200/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next hero slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-xl border border-stone-200/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        {/* Slide Pagination Indicator Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {BANNER_SLIDES.map((_, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-amber-400 shadow-md'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white'
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