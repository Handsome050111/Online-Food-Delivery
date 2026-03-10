import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Navigation, MapPin, Info, ArrowLeft, ShoppingBag } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import RatingStars from '../components/RatingStars';

const RESTAURANT = {
    id: 1, name: 'Burger Joint', category: 'American', rating: 4.8, reviews: 1240,
    deliveryTime: 25, deliveryFee: 0, minOrder: 1500,
    address: 'House 123, Street 4, F-8, Islamabad',
    description: 'Gourmet burgers, crispy fries, and thick shakes made to order with fresh, locally sourced ingredients.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    menu: {
        'Popular': [
            { id: 101, name: 'Classic Cheeseburger', price: 1299, description: 'Double beef patty, cheddar, lettuce, tomato, special sauce, pickles', popular: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
            { id: 102, name: 'Truffle Fries', price: 899, description: 'Crispy shoestring fries tossed in truffle oil and parmesan', popular: true, image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500&q=80' },
        ],
        'Burgers': [
            { id: 103, name: 'Bacon BBQ Burger', price: 1450, description: 'Single patty, thick-cut bacon, cheddar, onion rings, BBQ sauce', popular: false, image: 'https://images.unsplash.com/photo-1594212202677-7429188d8b9f?w=500&q=80' },
            { id: 104, name: 'Mushroom Swiss', price: 1350, description: 'Sautéed mushrooms, swiss cheese, caramelized onions, garlic aioli', popular: false, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&q=80' },
        ],
        'Sides': [
            { id: 105, name: 'Onion Rings', price: 599, description: 'Beer-battered thick cut onion rings with ranch', popular: false, image: 'https://images.unsplash.com/photo-1639024469595-da6645db7419?w=500&q=80' },
        ]
    }
};

const RestaurantDetails = () => {
    const { id } = useParams();
    const [activeCategory, setActiveCategory] = useState('Popular');

    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (item) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner */}
            <div className="relative h-64 md:h-80 bg-gray-900 group overflow-hidden">
                <img src={RESTAURANT.image} alt={RESTAURANT.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                    <Link to="/restaurants" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 rounded-full flex items-center justify-center transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content */}
                    <div className="flex-grow">
                        {/* Restaurant Info Card */}
                        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{RESTAURANT.name}</h1>
                                    <p className="text-gray-500 mb-5 leading-relaxed">{RESTAURANT.description}</p>
                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full font-bold">
                                            <Star size={16} fill="currentColor" strokeWidth={0} />
                                            <span>{RESTAURANT.rating} ({RESTAURANT.reviews}+)</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-gray-50 px-3.5 py-1.5 rounded-full">
                                            <Clock size={16} className="text-primary-500" />
                                            <span>{RESTAURANT.deliveryTime} mins</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-gray-50 px-3.5 py-1.5 rounded-full">
                                            <Navigation size={16} className="text-primary-500" />
                                            <span>{RESTAURANT.deliveryFee === 0 ? 'Free Delivery' : `Rs. ${RESTAURANT.deliveryFee.toFixed(0)} delivery`}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-5 border-t border-gray-100 text-gray-500 text-sm font-medium mt-2">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{RESTAURANT.address}</span>
                                <span className="mx-2 text-gray-300">•</span>
                                <Info size={16} className="text-gray-400" />
                                <span>Min. order Rs. {RESTAURANT.minOrder}</span>
                            </div>
                        </div>

                        {/* Menu Categories */}
                        <div className="sticky top-16 bg-gray-50 z-30 pt-4 pb-2 mb-8 overscroll-none shadow-[0_10px_10px_-10px_rgba(0,0,0,0.05)] border-b border-gray-200">
                            <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
                                {Object.keys(RESTAURANT.menu).map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${activeCategory === category
                                            ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 font-sans">{activeCategory}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {RESTAURANT.menu[activeCategory].map(item => (
                                    <FoodCard key={item.id} food={item} onAddToCart={() => handleAddToCart(item)} />
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Sticky Cart Sidebar */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="text-primary-500" />
                                    Your Order
                                </h2>
                                <span className="bg-primary-50 text-primary-700 border border-primary-100 text-xs font-bold px-3 py-1 rounded-full">{cartItems.length}</span>
                            </div>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm">
                                        <div className="flex gap-2">
                                            <span className="font-bold text-gray-900 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded text-xs">{item.qty}x</span>
                                            <span className="text-gray-700 font-bold">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">Rs. {(item.price * item.qty).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-dashed border-gray-200 space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">Rs. {cartTotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Delivery Fee</span>
                                    <span className="text-gray-900">Rs. {RESTAURANT.deliveryFee.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-primary-600">Rs. {(cartTotal + RESTAURANT.deliveryFee).toFixed(0)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-center py-4 rounded-xl transition-colors shadow-md active:scale-95 text-lg">
                                Go to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Cart Bar */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 transition-transform duration-300 ${cartItems.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                <Link to="/cart" className="flex items-center justify-between bg-primary-500 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                    <div className="flex items-center gap-3">
                        <span className="bg-white/20 w-8 h-8 flex items-center justify-center rounded-full text-sm">{cartItems.length}</span>
                        <span className="text-lg">View Cart</span>
                    </div>
                    <span className="text-lg">Rs. {(cartTotal + RESTAURANT.deliveryFee).toFixed(0)}</span>
                </Link>
            </div>

        </div>
    );
};

export default RestaurantDetails;
