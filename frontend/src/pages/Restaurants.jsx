import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import RestaurantCard from '../components/RestaurantCard';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Restaurants = () => {
    const [searchParams] = useSearchParams();
    const urlSearch = searchParams.get('search') || '';

    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [sortBy, setSortBy] = useState('Recommended');
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [visibleCount, setVisibleCount] = useState(6);

    // Sync search query with URL params
    useEffect(() => {
        setSearchQuery(urlSearch);
    }, [urlSearch]);

    // Fetch live restaurants on mount
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Fetch only active restaurants for the customer facing portal
                const { data } = await api.get('/restaurants?status=active');
                if (Array.isArray(data)) {
                    setRestaurants(data);
                } else if (data && data.success && Array.isArray(data.data)) {
                    setRestaurants(data.data);
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                toast.error("Failed to load restaurants.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    // Apply Filters & Search
    const filteredRestaurants = useMemo(() => {
        let result = [...restaurants];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                (r.name && r.name.toLowerCase().includes(query)) ||
                (r.category && r.category.toLowerCase().includes(query)) ||
                (r.tags && r.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }

        // Apply Custom Filters
        if (activeFilters.cuisines && activeFilters.cuisines.length > 0) {
            result = result.filter(r => activeFilters.cuisines.includes(r.category));
        }
        if (activeFilters.rating) {
            result = result.filter(r => r.rating >= activeFilters.rating);
        }
        if (activeFilters.deliveryTime) {
            const maxMins = parseInt(activeFilters.deliveryTime.match(/\d+/)[0]);
            result = result.filter(r => r.deliveryTime <= maxMins);
        }
        if (activeFilters.price) {
            if (activeFilters.price === '< 500') result = result.filter(r => r.deliveryFee < 500);
            else if (activeFilters.price === '500 - 1000') result = result.filter(r => r.deliveryFee >= 500 && r.deliveryFee < 1000);
            else if (activeFilters.price === '1000 - 1500') result = result.filter(r => r.deliveryFee >= 1000 && r.deliveryFee < 1500);
            else result = result.filter(r => r.deliveryFee >= 1500);
        }

        // Apply Sorting
        if (sortBy === 'Rating') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'Delivery Time') {
            result.sort((a, b) => a.deliveryTime - b.deliveryTime);
        }

        return result;
    }, [restaurants, searchQuery, activeFilters, sortBy]);

    const handleApplyFilters = (filters) => {
        setIsUpdating(true);
        setActiveFilters(filters);
        setVisibleCount(6); // Reset pagination on filter
        // Add fake delay to simulate processing heavy filters/API call
        setTimeout(() => {
            setIsUpdating(false);
            setShowMobileFilters(false); // Close mobile sidebar
        }, 400);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Search */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 font-sans tracking-tight">All Restaurants</h1>
                    <div className="flex gap-4 items-center">
                        <div className="flex-grow">
                            <SearchBar placeholder="Search for restaurants or cuisines..." onSearch={(val) => setSearchQuery(val)} />
                        </div>
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden flex items-center justify-center p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors"
                        >
                            <SlidersHorizontal size={22} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            <FilterSidebar onApplyFilters={handleApplyFilters} />
                        </div>
                    </div>

                    {/* Restaurant Grid */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Showing <span className="font-bold text-gray-900 dark:text-white">{filteredRestaurants.length}</span> restaurants</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sort by:</span>
                                <select
                                    className="bg-transparent border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-0 cursor-pointer outline-none pl-1 pr-6 py-0 focus:outline-none appearance-none hover:text-primary-600 transition-colors"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="Recommended">Recommended</option>
                                    <option value="Rating">Rating</option>
                                    <option value="Delivery Time">Delivery Time</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
                                <p className="font-medium">Loading live restaurants from database...</p>
                            </div>
                        ) : (
                            <>
                                <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
                                    {filteredRestaurants.length === 0 ? (
                                        <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 font-bold">No restaurants found matching your criteria.</div>
                                    ) : filteredRestaurants.slice(0, visibleCount).map(restaurant => (
                                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                    ))}
                                </div>

                                {visibleCount < filteredRestaurants.length && (
                                    <div className="mt-12 text-center">
                                        <button
                                            onClick={() => setVisibleCount(prev => prev + 6)}
                                            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700 px-10 py-3.5 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all active:scale-95"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurants;
