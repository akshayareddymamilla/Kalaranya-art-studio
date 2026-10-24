import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Award, 
  ArrowUp, 
  X,
  Mail,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface InfoModalContent {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<InfoModalContent | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const infoModals: Record<string, InfoModalContent> = {
    faq: {
      title: 'Frequently Asked Questions (FAQ)',
      subtitle: 'Everything you need to know about purchasing, shipping, and commissions',
      content: (
        <div className="space-y-4 text-sm text-studio-charcoal">
          <div>
            <h5 className="font-semibold text-studio-terracotta">How are original paintings packaged and shipped?</h5>
            <p className="text-studio-muted mt-1 leading-relaxed">
              Every canvas is wrapped in archival acid-free glassine paper, cushioned with corner guards, and encased in custom-built moisture-resistant wooden crates. All dispatches are 100% insured pan-India.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-studio-terracotta">How does on-site wall mural booking work?</h5>
            <p className="text-studio-muted mt-1 leading-relaxed">
              Our master artists travel directly to your residential or commercial site. Pricing is fixed at ₹150/sq ft (covering natural mineral pigments, primer prep, sealing coat, and artisan labor). You select your preferred start date (7–90 days ahead) and size.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-studio-terracotta">What is the lead time for custom studio pottery?</h5>
            <p className="text-studio-muted mt-1 leading-relaxed">
              Wheel-throwing, trimming, bisquing, applying custom food-safe ash/celadon glazes, and final kiln firing at 1220°C requires a minimum of 14 days curing lead time to guarantee durability and thermal shock resistance.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-studio-terracotta">Do paintings include certificates of authenticity?</h5>
            <p className="text-studio-muted mt-1 leading-relaxed">
              Yes. Each artwork arrives with an embossed, wax-sealed Certificate of Authenticity signed by the master artisan and the Kalāranya lead curator with provenance records.
            </p>
          </div>
        </div>
      ),
    },
    about: {
      title: 'About Kalāranya Art Studio & Atelier',
      subtitle: 'Preserving generational Indian master art forms with contemporary architectural sensibilities',
      content: (
        <div className="space-y-3 text-sm text-studio-muted leading-relaxed">
          <p>
            Founded in 2024, <strong className="text-studio-charcoal font-serif">Kalāranya</strong> bridges centuries-old Indian artisan traditions with modern residential and commercial interiors.
          </p>
          <p>
            Our collective brings together master craftsmen and women from Mithila (Madhubani), Maharashtra (Warli), Rajasthan (Pichwai), and Khurja (Studio Ceramics). We ensure fair artisan compensation, archival material sourcing, and museum-grade quality preservation.
          </p>
          <div className="bg-studio-ivory p-3.5 rounded-xl border border-studio-border flex items-center gap-3">
            <Award className="w-8 h-8 text-studio-terracotta flex-shrink-0" />
            <p className="text-xs text-studio-charcoal font-medium">
              Over 2,500 original artworks, 140+ architectural murals, and 6,000+ hand-thrown vessels placed in private collections across 18 countries.
            </p>
          </div>
        </div>
      ),
    },
    shipping: {
      title: 'Shipping & Pan-India Delivery',
      subtitle: 'Museum-grade packaging with end-to-end transit insurance',
      content: (
        <div className="space-y-3 text-sm text-studio-muted leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p><strong className="text-studio-charcoal">Delivery Timelines:</strong> Metro cities: 3–5 business days. Non-metro & Tier-2/3 cities: 5–8 business days via BlueDart Air / DTDC Express.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p><strong className="text-studio-charcoal">Free Pan-India Shipping:</strong> All original paintings and orders above ₹5,000 qualify for complimentary insured transit.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p><strong className="text-studio-charcoal">Zero-Damage Guarantee:</strong> Custom multi-layered wooden crates for large framed works and high-density foam molds for glazed pottery.</p>
          </div>
        </div>
      ),
    },
    replacement: {
      title: 'Replacements & Returns Policy',
      subtitle: 'Our 7-day peace-of-mind guarantee for collectors',
      content: (
        <div className="space-y-3 text-sm text-studio-muted leading-relaxed">
          <p>
            Because every fine art painting and pottery vessel is an authentic original handmade piece, slight variations in natural pigments and kiln fire patterns are natural marks of authenticity.
          </p>
          <p>
            <strong className="text-studio-charcoal">Transit Damage:</strong> In the rare event of transit damage, notify us within 48 hours of delivery with unboxing photos. We provide a full 100% refund or an artisan recreation of equal value.
          </p>
          <p>
            <strong className="text-studio-charcoal">7-Day Home Preview Exchange:</strong> If a painting does not harmoniously fit your wall palette, exchange it within 7 days for studio credit towards any other piece in our catalogue.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Patron Privacy & Terms',
      subtitle: 'Strict confidentiality of collector identities and site data',
      content: (
        <div className="space-y-3 text-sm text-studio-muted leading-relaxed">
          <p>
            Kalāranya respects collector privacy. We never share patron contact details, address records, or commissioned artwork valuations with external marketing entities.
          </p>
          <p>
            All online transactions are encrypted via 256-bit SSL protocols. Architectural mural site photography is only published with prior written patron consent.
          </p>
        </div>
      ),
    },
    testimonials: {
      title: 'Patron Testimonials & Reviews',
      subtitle: 'Words from art collectors, architects, and interior designers',
      content: (
        <div className="space-y-3.5 text-sm">
          <div className="bg-studio-ivory p-3.5 rounded-xl border border-studio-border">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-studio-charcoal italic text-xs leading-relaxed">
              "The Tree of Life Madhubani painting arrived in a flawless wooden crate. The mineral pigments possess a depth that photographs cannot capture. An heirloom for our living room."
            </p>
            <p className="text-[11px] text-studio-muted mt-2 font-medium">
              — Radhika & Arvind N., Bengaluru
            </p>
          </div>
          <div className="bg-studio-ivory p-3.5 rounded-xl border border-studio-border">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-studio-charcoal italic text-xs leading-relaxed">
              "Commissioned a 120 sq ft Pichwai wall mural for our courtyard villa. The master artists completed it in 4 days with breathtaking precision and natural cow-dung primer base."
            </p>
            <p className="text-[11px] text-studio-muted mt-2 font-medium">
              — Sameer Mehta, Principal Architect, Mumbai
            </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <>
      {/* Informational Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-studio-border relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-studio-sand text-studio-muted hover:text-studio-charcoal transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4 pr-6">
              <h3 className="text-xl font-serif font-bold text-studio-charcoal">
                {activeModal.title}
              </h3>
              <p className="text-xs text-studio-muted mt-1">
                {activeModal.subtitle}
              </p>
            </div>
            <div className="pt-2 border-t border-studio-border">
              {activeModal.content}
            </div>
            <div className="mt-6 pt-4 border-t border-studio-border flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-studio-charcoal text-white text-xs font-semibold rounded-lg hover:bg-studio-charcoal/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#FAF7F2] border-t border-studio-border mt-auto">
        {/* Top Trust Pillars Strip */}
        <div className="border-b border-studio-border/70 bg-white/70 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-studio-charcoal">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-studio-sand flex items-center justify-center text-studio-terracotta flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-studio-charcoal">Certified Authenticity</p>
                  <p className="text-[11px] text-studio-muted">Hand-signed artisan provenance</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-studio-sand flex items-center justify-center text-studio-terracotta flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-studio-charcoal">Insured Pan-India Transit</p>
                  <p className="text-[11px] text-studio-muted">Museum-grade wooden crating</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-studio-sand flex items-center justify-center text-studio-terracotta flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-studio-charcoal">100% Earth Minerals</p>
                  <p className="text-[11px] text-studio-muted">Natural plant & mineral pigments</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-studio-sand flex items-center justify-center text-studio-terracotta flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-studio-charcoal">Direct Artisan Sustenance</p>
                  <p className="text-[11px] text-studio-muted">Fair trade studio collective</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Column 1: Brand, Rating & Assistance (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <Link to="/" className="inline-block">
                  <img
                    src="/logo.png"
                    alt="Kalāranya Art Studio & Atelier"
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                <p className="text-xs font-serif italic text-studio-terracotta tracking-wide">
                  Parampara Se Samakaleen — Heritage Fine Art & Atelier
                </p>
                <p className="text-xs text-studio-muted max-w-md leading-relaxed">
                  An independent contemporary studio preserving generational Indian master art forms — original fine art canvas paintings, architectural wall frescoes, and wheel-thrown glazed pottery.
                </p>
              </div>

              {/* Collector Rating Card (Canvo inspired) */}
              <div className="inline-flex items-center gap-3 bg-white px-3.5 py-2.5 rounded-xl border border-studio-border shadow-xs">
                <div className="flex items-center gap-1.5 bg-[#1B7E5A] text-white font-bold text-xs px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>4.9 / 5</span>
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-studio-charcoal">
                    Trusted by 2,500+ Art Patrons
                  </span>
                  <span className="block text-[10px] text-studio-muted">
                    Verified Reviews & Architecture Commissions
                  </span>
                </div>
              </div>

              {/* Need Help Concierge */}
              <div className="pt-1 space-y-2.5">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-studio-charcoal">
                  Need Assistance?
                </h5>
                <div className="space-y-2 text-xs">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919845018920"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-studio-charcoal hover:text-emerald-700 transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {/* WhatsApp SVG Icon */}
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </span>
                    <span className="font-mono font-medium">+91 98450 18920</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:patron-care@kalaranya.in"
                    className="flex items-center gap-2.5 text-studio-charcoal hover:text-blue-700 transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-mono">patron-care@kalaranya.in</span>
                  </a>

                  {/* Hours */}
                  <div className="flex items-center gap-2 text-studio-muted text-[11px] pt-1">
                    <Clock className="w-3.5 h-3.5 text-studio-terracotta flex-shrink-0" />
                    <span>Monday — Saturday · 10:00 AM — 7:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="pt-1">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-studio-charcoal mb-2">
                  Follow Our Atelier
                </h5>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-studio-border text-xs text-studio-charcoal hover:border-pink-500 hover:text-pink-600 transition-colors shadow-xs"
                  >
                    {/* Instagram SVG */}
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>kalaranya.in</span>
                  </a>

                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-studio-border text-xs text-studio-charcoal hover:border-blue-600 hover:text-blue-600 transition-colors shadow-xs"
                  >
                    {/* Facebook SVG */}
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    <span>Kalāranya India</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Collections (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-studio-charcoal">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-studio-muted">
                <li>
                  <Link to="/paintings" className="hover:text-studio-terracotta transition-colors block py-0.5">
                    Original Fine Art Paintings
                  </Link>
                </li>
                <li>
                  <Link to="/book-wall" className="hover:text-studio-terracotta transition-colors block py-0.5">
                    Architectural Wall Murals
                  </Link>
                </li>
                <li>
                  <Link to="/custom-pottery" className="hover:text-studio-terracotta transition-colors block py-0.5">
                    Custom Wheel-Thrown Pottery
                  </Link>
                </li>
                <li>
                  <Link to="/paintings" className="hover:text-studio-terracotta transition-colors block py-0.5">
                    Madhubani & Folk Heritage
                  </Link>
                </li>
                <li>
                  <Link to="/paintings" className="hover:text-studio-terracotta transition-colors block py-0.5">
                    Pichwai & Temple Artworks
                  </Link>
                </li>
                <li>
                  <Link to="/paintings" className="hover:text-studio-terracotta transition-colors block py-0.5">
                    New Studio Releases
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Information & Services (lg:col-span-2) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-studio-charcoal">
                Information
              </h4>
              <ul className="space-y-2 text-xs text-studio-muted">
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.faq)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Frequently Asked Questions (FAQ's)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.testimonials)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Customer Testimonials & Reviews
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.replacement)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Replacement & Damage Request
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.about)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    About The Atelier & Artisans
                  </button>
                </li>
                <li>
                  <Link
                    to="/book-wall"
                    className="hover:text-studio-terracotta transition-colors block py-0.5"
                  >
                    Commission Architectural Mural
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:curator@kalaranya.in"
                    className="hover:text-studio-terracotta transition-colors block py-0.5"
                  >
                    Work With Us / Curators
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Policies (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-studio-charcoal">
                Policies
              </h4>
              <ul className="space-y-2 text-xs text-studio-muted">
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.shipping)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Shipping & Delivery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.replacement)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Refund & Return Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.privacy)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.privacy)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Privacy & Patron Care
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal(infoModals.faq)}
                    className="hover:text-studio-terracotta transition-colors text-left block py-0.5"
                  >
                    Certificate Authenticity Terms
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Scroll to Top */}
          <div className="border-t border-studio-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-studio-muted gap-4">
            <p>© {new Date().getFullYear()} Kalāranya Art Studio & Atelier. All rights reserved.</p>
            
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-studio-muted hidden md:inline">
                Handcrafted with heritage pride in India · 100% Genuine Artworks
              </span>
              
              {/* Back to top button (matching Canvo screenshot) */}
              <button
                onClick={scrollToTop}
                title="Scroll back to top"
                className="w-8 h-8 rounded-full bg-white border border-studio-border hover:border-studio-terracotta hover:text-studio-terracotta flex items-center justify-center text-studio-charcoal shadow-xs transition-all hover:-translate-y-0.5"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
