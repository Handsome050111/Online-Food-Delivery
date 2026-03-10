import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import RestaurantCard from '../components/RestaurantCard';
import { SlidersHorizontal } from 'lucide-react';

const RESTAURANTS_DATA = [
    { id: 1, name: 'Burger Joint', category: 'American', tags: ['Burgers', 'Fries', 'Shakes'], rating: 4.8, deliveryTime: 25, deliveryFee: 0, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', featured: true },
    { id: 2, name: 'Sushi Master', category: 'Japanese', tags: ['Sushi', 'Ramen', 'Bento'], rating: 4.9, deliveryTime: 40, deliveryFee: 250, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', featured: false },
    { id: 3, name: 'Pizza Paradise', category: 'Italian', tags: ['Pizza', 'Pasta', 'Salads'], rating: 4.6, deliveryTime: 30, deliveryFee: 150, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', featured: false },
    { id: 4, name: 'Spice Route', category: 'Pakistani', tags: ['Karahi', 'Naan', 'Tandoori'], rating: 4.7, deliveryTime: 35, deliveryFee: 0, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', featured: false },
    { id: 5, name: 'Taco Fiesta', category: 'Mexican', tags: ['Tacos', 'Burritos', 'Nachos'], rating: 4.5, deliveryTime: 20, deliveryFee: 199, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80', featured: false },
    { id: 6, name: 'Healthy Greens', category: 'Healthy', tags: ['Salads', 'Bowls', 'Smoothies'], rating: 4.8, deliveryTime: 45, deliveryFee: 399, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', featured: true },
    { id: 7, name: 'Wok This Way', category: 'Chinese', tags: ['Noodles', 'Dim Sum', 'Rice'], rating: 4.4, deliveryTime: 30, deliveryFee: 249, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80', featured: false },
    { id: 8, name: 'Grill & Chill', category: 'American', tags: ['Steak', 'Ribs', 'BBQ'], rating: 4.7, deliveryTime: 50, deliveryFee: 499, image: 'https://images.unsplash.com/photo-1544025162-8315ea07f440?w=800&q=80', featured: false },
];

const Restaurants = () => {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Recommended');
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [visibleCount, setVisibleCount] = useState(6);

    // Apply Filters & Search
    const filteredRestaurants = useMemo(() => {
        let result = [...RESTAURANTS_DATA];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.category.toLowerCase().includes(query) ||
                r.tags.some(tag => tag.toLowerCase().includes(query))
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
            if (activeFilters.price.includes('Under')) result = result.filter(r => r.deliveryFee < 150);
            else if (activeFilters.price.includes('500 - 1000')) result = result.filter(r => r.deliveryFee >= 150 && r.deliveryFee < 250);
            else if (activeFilters.price.includes('1000 - 2000')) result = result.filter(r => r.deliveryFee >= 250 && r.deliveryFee < 400);
            else result = result.filter(r => r.deliveryFee >= 400);
        }

        // Apply Sorting
        if (sortBy === 'Rating') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'Delivery Time') {
            result.sort((a, b) => a.deliveryTime - b.deliveryTime);
        }

        return result;
    }, [searchQuery, sortBy]);

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
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Search */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 font-sans tracking-tight">All Restaurants</h1>
                    <div className="flex gap-4 items-center">
                        <div className="flex-grow">
                            <SearchBar placeholder="Search for restaurants or cuisines..." onSearch={(val) => setSearchQuery(val)} />
                        </div>
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:text-primary-500 hover:border-primary-500 transition-colors"
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
                            <p className="text-gray-600 font-medium">Showing <span className="font-bold text-gray-900">{filteredRestaurants.length}</span> restaurants</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                                <select
                                    className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 cursor-pointer outline-none pl-1 pr-6 py-0 focus:outline-none appearance-none hover:text-primary-600 transition-colors"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="Recommended">Recommended</option>
                                    <option value="Rating">Rating</option>
                                    <option value="Delivery Time">Delivery Time</option>
                                </select>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
                            {filteredRestaurants.length === 0 ? (
                                <div className="col-span-full py-16 text-center text-gray-500 font-bold">No restaurants found matching your criteria.</div>
                            ) : filteredRestaurants.slice(0, visibleCount).map(restaurant => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>

                        {visibleCount < filteredRestaurants.length && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    className="bg-white text-gray-800 font-bold border border-gray-200 px-10 py-3.5 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all active:scale-95"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurants;
