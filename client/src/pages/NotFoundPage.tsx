import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-studio-sand flex items-center justify-center text-studio-terracotta mx-auto">
        <Palette className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-4xl font-bold text-studio-charcoal">404</h1>
      <h2 className="font-serif text-xl font-medium text-studio-charcoal">Atelier Page Not Found</h2>
      <p className="text-sm text-studio-muted leading-relaxed">
        The gallery exhibit, booking record, or commission request you are looking for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-studio-terracotta text-white text-xs font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Studio Home
        </Link>
      </div>
    </div>
  );
};
