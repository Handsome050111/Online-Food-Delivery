import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 transition-transform hover:scale-105 inline-flex">
                            <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                                <UtensilsCrossed size={20} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Food<span className="text-primary-500">Express</span></span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            Delicious food from your favorite local restaurants delivered at lightning speed to your door.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary-500 transition-all"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary-500 transition-all"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary-500 transition-all"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary-500 transition-all"><Youtube size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/restaurants" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Restaurants</Link></li>
                            <li><Link to="/about" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">About Us</Link></li>
                            <li><Link to="/partner" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform font-bold text-primary-500">Partner With Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Contact</Link></li>
                            <li><Link to="/blog" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Legal</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/terms" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Privacy Policy</Link></li>
                            <li><Link to="/cookie" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">Subscribe to get special offers and updates.</p>
                        <div className="flex shadow-sm">
                            <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 bg-gray-800 border-y border-l border-gray-700 rounded-l-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm placeholder-gray-500 text-white transition-all" />
                            <button className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-r-md transition-colors text-sm font-medium border-y border-r border-primary-500 hover:border-primary-600">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} FoodExpress Inc. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>Made with ❤️ for food lovers.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
