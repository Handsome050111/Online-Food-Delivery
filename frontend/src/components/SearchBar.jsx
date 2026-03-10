import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const SearchBar = ({ placeholder = "Search for restaurants or dishes...", onSearch }) => {
    const [location, setLocation] = useState('Islamabad');
    const [showDropdown, setShowDropdown] = useState(false);

    const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Quetta'];

    return (
        <div className="flex w-full items-center bg-white rounded-full p-2 shadow-lg max-w-2xl mx-auto border border-gray-100 transition-shadow focus-within:shadow-xl focus-within:border-primary-300 relative z-50">
            <div
                className="hidden sm:flex items-center pl-4 pr-3 text-gray-400 border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-l-full py-1 transition-colors relative"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <MapPin size={20} className="mr-2 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{location}</span>
                <ChevronDown size={16} className="ml-1 text-gray-400" />
            </div>

            {showDropdown && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 bg-white border border-gray-100 shadow-xl rounded-xl z-50 w-48 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {cities.map(city => (
                        <div
                            key={city}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors text-left ${location === city ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
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
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base py-1.5"
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
