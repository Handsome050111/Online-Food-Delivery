import React, { useState } from 'react';
import { Filter, Star } from 'lucide-react';

const CUISINES = ['American', 'Italian', 'Japanese', 'Pakistani', 'Mexican', 'Chinese', 'Healthy', 'Fast Food'];
const PRICE_RANGES = ['Under Rs. 500', 'Rs. 500 - 1000', 'Rs. 1000 - 2000', 'Rs. 2000+'];

const FilterSidebar = ({ className = "", onApplyFilters }) => {
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines(prev =>
            prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
        );
    };

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Filter className="text-primary-500" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-3">Cuisines</h3>
                <div className="space-y-2.5">
                    {CUISINES.map((cuisine) => (
                        <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedCuisines.includes(cuisine)}
                                onChange={() => handleCuisineChange(cuisine)}
                                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm font-medium">{cuisine}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2.5">
                    {[4, 3, 2].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                checked={selectedRating === rating}
                                onChange={() => setSelectedRating(rating)}
                                className="w-4 h-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                            />
                            <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(rating)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                ))}
                                <span className="text-gray-600 group-hover:text-gray-900 ml-1 text-sm font-medium transition-colors">
                                    & Up
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-3">Delivery Time</h3>
                <div className="space-y-2.5">
                    {['Under 30 mins', 'Under 45 mins', 'Under 60 mins'].map((time) => (
                        <label key={time} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="time"
                                checked={selectedTime === time}
                                onChange={() => setSelectedTime(time)}
                                className="w-4 h-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm font-medium">{time}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                <div className="flex gap-2">
                    {PRICE_RANGES.map((price) => (
                        <button
                            key={price}
                            onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
                            className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-1 py-1.5 border rounded-lg text-xs sm:text-xs font-medium transition-colors focus:ring-2 focus:ring-primary-100 focus:outline-none ${selectedPrice === price ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-500 bg-gray-50'}`}
                            title={price}
                        >
                            {price}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onApplyFilters && onApplyFilters({
                    cuisines: selectedCuisines,
                    rating: selectedRating,
                    deliveryTime: selectedTime,
                    price: selectedPrice
                })}
                className="w-full bg-primary-50/50 text-primary-600 font-bold py-3 rounded-xl border border-primary-100 hover:bg-primary-500 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default FilterSidebar;
