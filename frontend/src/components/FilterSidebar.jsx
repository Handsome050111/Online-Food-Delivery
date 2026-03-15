import React, { useState } from 'react';
import { Filter, Star } from 'lucide-react';

const CUISINES = ['American', 'Italian', 'Japanese', 'Pakistani', 'Mexican', 'Chinese', 'Healthy', 'Fast Food'];
const PRICE_RANGES = ['< 500', '500 - 1000', '1000 - 1500', '1500+'];

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
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300 ${className}`}>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <Filter className="text-primary-500" size={20} />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
            </div>

            <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Cuisines</h3>
                <div className="space-y-2.5">
                    {CUISINES.map((cuisine) => (
                        <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedCuisines.includes(cuisine)}
                                onChange={() => handleCuisineChange(cuisine)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-800"
                            />
                            <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-sm font-medium">{cuisine}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Rating</h3>
                <div className="space-y-2.5">
                    {[4, 3, 2].map((rating) => (
                        <div 
                            key={rating} 
                            onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                            className={`flex items-center gap-3 cursor-pointer group p-1.5 rounded-lg transition-colors ${selectedRating === rating ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedRating === rating ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-700'}`}>
                                {selectedRating === rating && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(rating)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                ))}
                                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ml-1 text-sm font-medium transition-colors">
                                    & Up
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Delivery Time</h3>
                <div className="space-y-2.5">
                    {['Under 30 mins', 'Under 45 mins', 'Under 60 mins'].map((time) => (
                        <div 
                            key={time} 
                            onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                            className={`flex items-center gap-3 cursor-pointer group p-1.5 rounded-lg transition-colors ${selectedTime === time ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedTime === time ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-700'}`}>
                                {selectedTime === time && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-sm font-medium">{time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-2.5">
                    {PRICE_RANGES.map((price) => (
                        <button
                            key={price}
                            onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
                            className={`px-1 py-2.5 border rounded-xl text-center transition-all focus:outline-none shadow-sm active:scale-95 ${selectedPrice === price ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 bg-gray-50 dark:bg-gray-800'}`}
                            title={price}
                        >
                            <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">
                                {price}
                            </span>
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
                className="w-full bg-primary-50/50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 font-bold py-3 rounded-xl border border-primary-100 dark:border-primary-800 hover:bg-primary-500 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default FilterSidebar;
