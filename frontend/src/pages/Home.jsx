import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, Wallet, Loader2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Home = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [popularDishes, setPopularDishes] = useState([]);
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
    const [isLoadingDishes, setIsLoadingDishes] = useState(true);

    useEffect(() => {
        const fetchPopularRestaurants = async () => {
            try {
                // Fetch top 4 restaurants based on DB query
                const { data } = await api.get('/restaurants?status=active');
                if (data.success) {
                    setPopularRestaurants(data.data.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching popular restaurants:", error);
            } finally {
                setIsLoadingRestaurants(false);
            }
        }

        const fetchPopularDishes = async () => {
            try {
                const { data } = await api.get('/menu?popular=true&limit=4');
                if (data.success) {
                    setPopularDishes(data.data);
                }
            } catch (error) {
                console.error("Error fetching popular dishes:", error);
            } finally {
                setIsLoadingDishes(false);
            }
        }

        fetchPopularRestaurants();
        fetchPopularDishes();
    }, []);

    const handleSearch = (query) => {
        if (query.trim()) {
            navigate(`/restaurants?search=${encodeURIComponent(query)}`);
        }
    };

    const handleAddToCart = (dish) => {
        addToCart(dish, dish.restaurantId || { _id: 'pop_res', name: 'Popular Dishes Co.', deliveryFee: 0 });
        toast.success(`${dish.name} added to cart!`);
    };

    return (
        <div className="bg-gray-50 flex flex-col w-full overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-white pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
                <div className="absolute inset-0 bg-primary-50/70 -skew-y-3 origin-bottom-left transform-gpu -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                            Delicious Food <br className="hidden md:block" />
                            <span className="text-primary-500">Delivered To Your Door</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-600 mb-12 font-medium max-w-3xl mx-auto">
                            Choose from thousands of local restaurants and get your favorite meals delivered fast and fresh.
                        </p>
                        <div className="animate-in slide-in-from-bottom flex justify-center fade-in duration-700 delay-100">
                            <SearchBar placeholder="Search for restaurants, cuisines, or dishes..." onSearch={handleSearch} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <section className="py-20 bg-white border-y border-gray-100 shadow-sm relative z-20 -mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center p-6 group">
                            <div className="bg-primary-50 text-primary-600 p-5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                                <Clock size={36} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Fast Delivery</h3>
                            <p className="text-gray-500 leading-relaxed text-base">Get your food delivered in under 30 minutes with our lightning-fast riders.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 group">
                            <div className="bg-primary-50 text-primary-600 p-5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                                <ShieldCheck size={36} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Live Tracking</h3>
                            <p className="text-gray-500 leading-relaxed text-base">Track your order in real-time from the restaurant directly to your doorstep.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 group">
                            <div className="bg-primary-50 text-primary-600 p-5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                                <Wallet size={36} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Payments</h3>
                            <p className="text-gray-500 leading-relaxed text-base">Pay securely with multiple options including cards, digital wallets, or COD.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Restaurants */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Popular Restaurants</h2>
                            <p className="text-gray-500 text-lg">Discover the best places to eat around you</p>
                        </div>
                        <Link to="/restaurants" className="hidden sm:inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors group">
                            See all
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[200px]">
                        {isLoadingRestaurants ? (
                            <div className="col-span-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
                            </div>
                        ) : popularRestaurants.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 font-bold py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p>No popular restaurants available right now.</p>
                            </div>
                        ) : popularRestaurants.map(restaurant => (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                        ))}
                    </div>
                    <div className="mt-10 text-center sm:hidden">
                        <Link to="/restaurants" className="inline-block bg-white text-gray-800 font-bold border border-gray-200 px-8 py-3 rounded-full shadow-sm">
                            See all restaurants
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular Dishes */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Popular Dishes Near You</h2>
                        <p className="text-gray-500 text-lg">Trending food items available for prompt delivery</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[200px]">
                        {isLoadingDishes ? (
                            <div className="col-span-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
                            </div>
                        ) : popularDishes.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 font-bold py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p>No popular dishes available right now.</p>
                            </div>
                        ) : popularDishes.map(dish => (
                            <FoodCard key={dish._id} food={dish} onAddToCart={() => handleAddToCart(dish)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="py-24 relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1600&q=80"
                        alt="CTA Background"
                        className="w-full h-full object-cover opacity-20 transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Hungry? We've got you covered.</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who have revolutionized their dining experience with FoodExpress.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/restaurants" className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-primary-500/30 active:scale-95">
                            Order Now
                        </Link>
                        <Link to="/signup" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-lg px-10 py-4 rounded-full transition-all active:scale-95">
                            Create an account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
