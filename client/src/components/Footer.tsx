import React from 'react';
import { Palette } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-studio-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-studio-terracotta/10 border border-studio-terracotta/20 flex items-center justify-center text-studio-terracotta">
                <Palette className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-studio-charcoal">
                KALĀRANYA
              </span>
            </div>
            <p className="text-sm text-studio-muted max-w-sm leading-relaxed">
              An independent contemporary studio preserving Indian traditional art forms, offering one-of-a-kind original paintings, architectural wall murals, and artisanal custom glazed pottery.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-4">
              Studio Offerings
            </h4>
            <ul className="space-y-2 text-sm text-studio-muted">
              <li>Original Fine Art Paintings</li>
              <li>Hand-Painted Wall Murals (₹150 / sq ft)</li>
              <li>Custom Wheel-Thrown Pottery</li>
              <li>Traditional Natural Glazes</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-studio-charcoal mb-4">
              Recruitment Evaluation
            </h4>
            <div className="text-xs text-studio-muted space-y-2 bg-studio-ivory p-3.5 rounded-lg border border-studio-border">
              <p className="font-medium text-studio-charcoal">GDGC Volunteer Recruitment</p>
              <p>Studio Admin (Seed): <span className="font-mono text-[11px]">studio@artstudio.in</span></p>
              <p>Patron Accounts: <span className="text-[11px]">Register via Sign-Up</span></p>
            </div>
          </div>
        </div>

        <div className="border-t border-studio-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-studio-muted gap-4">
          <p>© {new Date().getFullYear()} Kalāranya Art Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with care, correctness & reliability first.
          </p>
        </div>
      </div>
    </footer>
  );
};
