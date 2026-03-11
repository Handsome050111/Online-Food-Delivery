import React from 'react';
import { ShoppingBag, Star, DollarSign, TrendingUp, Check, X } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const OwnerDashboard = () => {
    return (
        <div>
            <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Burger Joint Dashboard</h1>
                    <p className="text-gray-500 font-medium pt-1">Manage your restaurant operations from here.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-lg border border-green-200 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500"></div>
                    <span className="text-sm font-bold tracking-wide">ACCEPTING ORDERS</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Today's Sales" value="$0" icon={DollarSign} colorClass="text-green-600 bg-green-100" />
                <StatsCard title="Orders Today" value="0" icon={ShoppingBag} colorClass="text-blue-600 bg-blue-100" />
                <StatsCard title="Average Rating" value="0.0" icon={Star} colorClass="text-amber-500 bg-amber-100" />
                <StatsCard title="Revenue (Month)" value="$0" icon={TrendingUp} colorClass="text-purple-600 bg-purple-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-3">
                            Live Orders
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-500 font-bold text-center py-8">No active orders right now.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Popular Menu Items</h2>
                        <button className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Edit Menu</button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-500 font-bold text-center py-8">No menu items found.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
