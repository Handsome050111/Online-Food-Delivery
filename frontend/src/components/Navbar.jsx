import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, UtensilsCrossed, Menu, Search, X, LogOut, MapPin, Locate, Moon, Sun, Monitor } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const { cart } = useCart();
    const { city, detectLocation } = useLocation();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    // Read user auth state
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    // Calculate total items in cart safely
    const cartItems = cart?.items || [];
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleDetectLocation = async () => {
        const toastId = toast.loading('Detecting location...');
        try {
            await detectLocation();
            toast.success('Location updated!', { id: toastId });
        } catch (err) {
            toast.error(err || 'Could not detect location', { id: toastId });
        }
    };

    const getDashboardLink = () => {
        if (!userInfo) return '/login';
        switch (userInfo.role) {
            case 'admin': return '/admin';
            case 'owner': return '/owner';
            case 'rider': return '/rider';
            default: return '/profile'; // Customer profile or settings
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo & Location */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className={`flex items-center gap-2 group ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
                            <div className="bg-primary-500 text-white p-1.5 rounded-lg group-hover:bg-primary-600 transition-colors">
                                <UtensilsCrossed size={24} />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Food<span className="text-primary-500">Express</span></span>
                        </Link>

                        <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group`} onClick={handleDetectLocation}>
                            <MapPin size={16} className="text-primary-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{city}</span>
                            <Locate size={14} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className={`hidden md:flex items-center space-x-8 ${isSearchOpen ? 'md:hidden' : ''}`}>
                        <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">Home</Link>
                        <Link to="/restaurants" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">Restaurants</Link>
                        <Link to="/orders" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">Orders</Link>
                    </div>

                    {/* Search Bar (Expanded) */}
                    {isSearchOpen && (
                        <div className="flex-1 max-w-lg mx-4 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search restaurants or food..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-gray-700 dark:text-gray-200" 
                                autoFocus 
                            />
                            <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Right actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {!isSearchOpen && (
                            <button onClick={() => setIsSearchOpen(true)} className="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">
                                <Search size={22} />
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setIsThemeOpen(!isThemeOpen)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors flex items-center justify-center"
                                title="Change Theme"
                            >
                                {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
                            </button>
                            
                            {isThemeOpen && (
                                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <button 
                                        onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${theme === 'light' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                    >
                                        <Sun size={16} /> Light Mode
                                    </button>
                                    <button 
                                        onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${theme === 'dark' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                    >
                                        <Moon size={16} /> Dark Mode
                                    </button>
                                    <button 
                                        onClick={() => { setTheme('system'); setIsThemeOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${theme === 'system' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                    >
                                        <Monitor size={16} /> System
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link to="/cart" className="relative text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors p-2 group">
                            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 dark:border-gray-800 pl-4 ml-2">
                            {userInfo ? (
                                <div className="flex items-center gap-4">
                                    <Link 
                                        to={getDashboardLink()} 
                                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                            <User size={18} />
                                        </div>
                                        <span className="hidden lg:block">{userInfo.name?.split(' ')[0]}</span>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 flex items-center justify-center"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors px-2 py-1 font-medium">Log in</Link>
                                    <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md active:scale-95">Sign Up</Link>
                                </>
                            )}
                        </div>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none p-2 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[100] bg-white dark:bg-gray-900 animate-in slide-in-from-right duration-300">
                    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                        {/* Mobile Menu Header */}
                        <div className="flex justify-between items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                                <UtensilsCrossed size={24} className="text-primary-500" />
                                <span className="text-xl font-bold dark:text-white text-gray-900">Food<span className="text-primary-500">Express</span></span>
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 dark:text-gray-400">
                                <X size={26} />
                            </button>
                        </div>

                        {/* Mobile Links */}
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">Home</Link>
                            <Link to="/restaurants" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">Restaurants</Link>
                            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">Orders</Link>
                            
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-4"></div>
                            
                            <div className="px-4 py-2">
                                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Appearance</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                        <Sun size={20} />
                                        <span className="text-[10px] font-bold">Light</span>
                                    </button>
                                    <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                        <Moon size={20} />
                                        <span className="text-[10px] font-bold">Dark</span>
                                    </button>
                                    <button onClick={() => setTheme('system')} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${theme === 'system' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                        <Monitor size={20} />
                                        <span className="text-[10px] font-bold">System</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Footer (CTA/Profile) */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                            {userInfo ? (
                                <div className="space-y-4">
                                    <Link 
                                        to={getDashboardLink()} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-[20px] transition-all hover:scale-[0.98] active:scale-95"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 dark:text-white leading-none mb-1">{userInfo.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{userInfo.role}</p>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-black tracking-wide bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut size={20} /> Logout Account
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-4 text-gray-700 dark:text-white font-bold bg-gray-50 dark:bg-gray-800 rounded-2xl transition-all active:scale-95">Log in</Link>
                                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-4 bg-primary-500 text-white font-black rounded-2xl shadow-lg shadow-primary-500/20 transition-all active:scale-95">Join Now</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
