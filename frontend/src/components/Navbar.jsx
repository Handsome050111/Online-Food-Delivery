import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, UtensilsCrossed, Menu, Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cart } = useCart();

    // Calculate total items in cart safely
    const cartItems = cart?.items || [];
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className={`flex items-center gap-2 group ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
                        <div className="bg-primary-500 text-white p-1.5 rounded-lg group-hover:bg-primary-600 transition-colors">
                            <UtensilsCrossed size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Food<span className="text-primary-500">Express</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className={`hidden md:flex items-center space-x-8 ${isSearchOpen ? 'md:hidden' : ''}`}>
                        <Link to="/" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Home</Link>
                        <Link to="/restaurants" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Restaurants</Link>
                        <Link to="/orders" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Orders</Link>
                    </div>

                    {/* Search Bar (Expanded) */}
                    {isSearchOpen && (
                        <div className="flex-1 max-w-lg mx-4 flex items-center bg-gray-100 rounded-full px-4 py-2 transition-all duration-300">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input type="text" placeholder="Search restaurants or food..." className="bg-transparent border-none focus:outline-none w-full text-sm font-medium" autoFocus />
                            <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Right actions */}
                    <div className="flex items-center space-x-4">
                        {!isSearchOpen && (
                            <button onClick={() => setIsSearchOpen(true)} className="flex items-center justify-center text-gray-500 hover:text-primary-500 transition-colors">
                                <Search size={22} />
                            </button>
                        )}
                        <Link to="/cart" className="relative text-gray-600 hover:text-primary-500 transition-colors p-2">
                            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                            <Link to="/login" className="text-gray-600 hover:text-primary-500 font-medium px-2 py-1 transition-colors">Log in</Link>
                            <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md active:scale-95">Sign Up</Link>
                        </div>
                        <button className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
