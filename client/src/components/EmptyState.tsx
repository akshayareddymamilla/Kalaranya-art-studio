import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-full bg-studio-sand flex items-center justify-center mb-4 text-studio-terracotta">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-serif font-medium text-studio-charcoal mb-2">{title}</h3>
      <p className="text-sm text-studio-muted mb-6 leading-relaxed">{description}</p>
      
      {actionHref && actionText && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-studio-terracotta text-white text-sm font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm"
        >
          {actionText}
        </Link>
      )}

      {onAction && actionText && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-studio-terracotta text-white text-sm font-medium hover:bg-studio-terracotta-hover transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
