import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';

export const TopHero: React.FC = () => {
  return (
    <div className="relative w-full bg-[#EFEAE0]">
      {/* Split Hero: Editorial Narrative Left + Staged Art Wall Right */}
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[530px] items-stretch">
          
          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center px-6 sm:px-10 lg:pl-14 lg:pr-8 py-10 lg:py-14 z-10">
            {/* Kicker */}
            <div className="flex items-center gap-3 text-xs tracking-[0.22em] font-medium uppercase text-[#A64A26] mb-4">
              <span className="w-6 h-[1.5px] bg-[#A64A26]" />
              <span>ORIGINAL INDIAN ART</span>
              <span className="w-6 h-[1.5px] bg-[#A64A26]" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-serif font-normal text-[#2A2421] leading-[1.12] tracking-tight mb-5">
              Timeless art forms<br />
              handcrafted for the<br />
              <span className="italic font-normal text-[#A64A26] font-serif">mindful sanctuary.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light max-w-lg mb-8">
              Kalāranya Studio unites traditional heritage with contemporary living. Each painting is strictly one-of-a-kind and accompanied by a verified Certificate of Authenticity.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/paintings"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-[#A64A26] text-white font-medium hover:bg-[#8F3E1E] transition-all duration-200 shadow-sm text-sm"
              >
                Explore Paintings
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/book-wall"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#E8E2D6] border border-[#BFB4A3] text-[#2A2421] font-medium hover:bg-[#DFD8CC] transition-all duration-200 shadow-sm text-sm"
              >
                Book Wall Consultation
              </Link>
            </div>
          </div>

          {/* Right Column: In-Situ Staged Art Wall Image */}
          <div className="lg:col-span-7 xl:col-span-7 relative min-h-[360px] lg:min-h-[530px] overflow-hidden">
            <img
              src="/images/hero-room.jpg"
              alt="Kalāranya In-Situ Fine Art Living Room"
              className="w-full h-full object-cover object-center lg:object-left"
            />
            {/* Subtle left gradient blend for seamless continuity */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#EFEAE0] to-transparent pointer-events-none" />
          </div>
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