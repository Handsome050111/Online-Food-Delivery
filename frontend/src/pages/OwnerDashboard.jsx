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
                <StatsCard title="Today's Sales" value="$1,245" icon={DollarSign} trend="up" trendValue="8.5%" colorClass="text-green-600 bg-green-100" />
                <StatsCard title="Orders Today" value="124" icon={ShoppingBag} trend="up" trendValue="12.2%" colorClass="text-blue-600 bg-blue-100" />
                <StatsCard title="Average Rating" value="4.8" icon={Star} colorClass="text-amber-500 bg-amber-100" />
                <StatsCard title="Revenue (Month)" value="$28,450" icon={TrendingUp} trend="up" trendValue="3.1%" colorClass="text-purple-600 bg-purple-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-3">
                            Live Orders
                            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-sm">3 New</span>
                        </h2>
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow hover:border-gray-200 transition-all">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                    <div>
                                        <h3 className="font-extrabold text-gray-900 mb-1">Order #OD-102{i}</h3>
                                        <p className="text-sm text-gray-500 font-bold">2 items • $24.99 • Placed 5m ago</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
                                        Preparing
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-sm">
                                        <Check size={18} strokeWidth={3} /> Order Ready
                                    </button>
                                    <button className="flex items-center justify-center p-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors focus:outline-none active:scale-95 shadow-sm">
                                        <X size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Popular Menu Items</h2>
                        <button className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Edit Menu</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Classic Cheeseburger', qty: 45, price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80' },
                            { name: 'Truffle Fries', qty: 38, price: 6.99, image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=100&q=80' },
                            { name: 'Bacon BBQ Burger', qty: 29, price: 14.50, image: 'https://images.unsplash.com/photo-1594212202677-7429188d8b9f?w=100&q=80' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group p-2 -mx-2 transition-colors hover:bg-gray-50 rounded-xl cursor-pointer">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 flex justify-between items-center pr-2">
                                    <div>
                                        <h4 className="font-extrabold text-gray-900 text-sm sm:text-base leading-tight mb-1">{item.name}</h4>
                                        <p className="text-sm font-bold text-primary-600">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-extrabold text-gray-900 leading-none mb-1">{item.qty}</p>
                                        <p className="text-xs text-gray-500 font-bold">sold this week</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
