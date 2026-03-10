import React from 'react';
import { User, MapPin, CreditCard, Settings, LogOut, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
                            <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
                                JD
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900">John Doe</h2>
                            <p className="text-gray-500 text-sm font-medium">john.doe@example.com</p>
                        </div>

                        <nav className="space-y-2">
                            <Link to="/profile" className="flex items-center gap-3 bg-primary-50 text-primary-600 font-bold px-4 py-3 rounded-xl transition-colors">
                                <User size={20} />
                                Personal Info
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors">
                                <Package size={20} />
                                My Orders
                            </Link>
                            <button className="flex w-full items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors text-left">
                                <MapPin size={20} />
                                Saved Addresses
                            </button>
                            <button className="flex w-full items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors text-left">
                                <CreditCard size={20} />
                                Payment Methods
                            </button>
                            <button className="flex w-full items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors text-left">
                                <Settings size={20} />
                                Settings
                            </button>
                            <button className="flex w-full items-center gap-3 text-red-500 hover:bg-red-50 font-bold px-4 py-3 rounded-xl transition-colors text-left mt-8">
                                <LogOut size={20} />
                                Logout
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
                            <form className="space-y-6 border-b border-gray-100 pb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" defaultValue="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" defaultValue="Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" defaultValue="john.doe@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" defaultValue="+1 (555) 123-4567" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="button" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm active:scale-95">
                                        Save Changes
                                    </button>
                                </div>
                            </form>

                            {/* Password Section */}
                            <div className="pt-8">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Change Password</h2>
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div className="flex justify-start pt-2">
                                        <button type="button" className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm active:scale-95">
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
