import { getRatingColor } from '../utils/formatters';
import type { Rating } from '../types';

interface RatingBadgeProps {
  rating: Rating;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-sm flex items-center justify-center font-bold text-white`}
      style={{ backgroundColor: getRatingColor(rating) }}
    >
      {rating}
    </div>
  );
}
