import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const SearchBar = ({ placeholder = "Search for restaurants or dishes...", onSearch }) => {
    const { city: location, setCity: setLocation, detectLocation } = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);

    const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Quetta'];

    return (
        <div className="flex w-full items-center bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg max-w-2xl mx-auto border border-gray-100 dark:border-gray-800 transition-all focus-within:shadow-xl focus-within:border-primary-300 dark:focus-within:border-primary-700 relative z-50">
            <div
                className="hidden sm:flex items-center pl-4 pr-3 text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-full py-1 transition-colors relative"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <MapPin size={20} className="mr-2 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{location}</span>
                <ChevronDown size={16} className="ml-1 text-gray-400" />
            </div>

            {showDropdown && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl z-50 w-64 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <button 
                        onClick={() => {
                            detectLocation();
                            setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold text-sm flex items-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors border-b border-primary-100 dark:border-primary-800"
                    >
                        <Navigation size={14} fill="currentColor" />
                        Detect My Location
                    </button>
                    {cities.map(city => (
                        <div
                            key={city}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors text-left ${location === city ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            onClick={() => {
                                setLocation(city);
                                setShowDropdown(false);
                            }}
                        >
                            {city}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-grow flex items-center pl-4 w-full">
                <Search size={20} className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base py-1.5"
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSearch) {
                            onSearch(e.currentTarget.value);
                        }
                    }}
                />
            </div>
            <button
                onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling.querySelector('input');
                    if (onSearch && input) onSearch(input.value);
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6 sm:px-8 py-2.5 font-medium transition-all shadow-md hover:shadow-lg active:scale-95 focus:outline-none ml-2 whitespace-nowrap"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
