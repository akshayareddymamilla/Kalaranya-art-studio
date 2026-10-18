import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = 'py-12',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-serif font-medium text-studio-charcoal mb-1">{title}</h3>
      <p className="text-sm text-studio-muted mb-5 leading-relaxed">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-studio-border bg-white text-studio-charcoal text-sm font-medium hover:bg-studio-sand transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-studio-muted" />
          Try Again
        </button>
      )}
    </div>
  );
};
