import React from 'react';

export interface StatusBadgeProps {
  status: 'available' | 'sold' | 'placed' | 'requested' | 'confirmed' | 'declined' | 'cancelled' | 'accepted';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'sold':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'placed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'requested':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'confirmed':
      case 'accepted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'declined':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'cancelled':
        return 'bg-stone-100 text-stone-600 border-stone-200 line-through';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'available': return 'Available';
      case 'sold': return 'Sold';
      case 'placed': return 'Order Placed';
      case 'requested': return 'Pending Studio Review';
      case 'confirmed': return 'Confirmed by Studio';
      case 'accepted': return 'Accepted for Production';
      case 'declined': return 'Declined';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getBadgeStyle()} ${className}`}
    >
      {getLabel()}
    </span>
  );
};
