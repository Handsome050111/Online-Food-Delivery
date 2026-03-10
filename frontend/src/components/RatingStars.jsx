import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 0, count = 0, showCount = true }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
                {[...Array(Math.max(0, fullStars))].map((_, i) => (
                    <Star key={`full-${i}`} size={16} fill="currentColor" strokeWidth={0} />
                ))}
                {hasHalfStar && <StarHalf size={16} fill="currentColor" strokeWidth={0} />}
                {[...Array(Math.max(0, emptyStars))].map((_, i) => (
                    <Star key={`empty-${i}`} size={16} className="text-gray-300" strokeWidth={1} />
                ))}
            </div>
            {showCount && count > 0 && (
                <span className="text-xs text-gray-500 font-medium">({count})</span>
            )}
            {!showCount && rating > 0 && (
                <span className="text-xs font-bold text-gray-800 ml-0.5">{rating.toFixed(1)}</span>
            )}
        </div>
    );
};

export default RatingStars;
