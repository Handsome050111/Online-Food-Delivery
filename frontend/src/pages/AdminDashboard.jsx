import React, { useState, useEffect } from 'react';
import { DollarSign, Store, Users, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/dashboard/admin');
                setStats(data.stats);
                setRecentOrders(data.recentOrders);
                setTopRestaurants(data.topRestaurants);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', colorClass: 'text-green-600 bg-green-100' },
        { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, trend: '+8.2%', colorClass: 'text-blue-600 bg-blue-100' },
        { title: 'Registered Users', value: stats.totalUsers.toLocaleString(), icon: Users, trend: '+5.4%', colorClass: 'text-purple-600 bg-purple-100' },
        { title: 'Active Restaurants', value: stats.totalRestaurants.toLocaleString(), icon: Store, trend: '+2.1%', colorClass: 'text-orange-600 bg-orange-100' },
    ];

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-bold">Loading dashboard data...</div>;
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => {
                    const IconComponent = card.icon;
                    const TrendIcon = card.trend.startsWith('+') ? TrendingUp : TrendingDown;
                    return (
                        <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.colorClass.replace('bg-', 'dark:bg-').replace('100', '900/30')}`}>
                                    <IconComponent size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold ${card.trend.startsWith('+') ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'} px-2.5 py-1 rounded-lg`}>
                                    <TrendIcon size={16} />
                                    <span>{card.trend}</span>
                                </div>
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">{card.title}</h3>
                            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{card.value}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg transition-colors">View All</Link>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Order ID</th>
                                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Customer</th>
                                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Amount</th>
                                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-8 text-gray-500 font-bold">No recent orders yet.</td></tr>
                                ) : recentOrders.map((order, index) => (
                                    <tr key={index} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-2">
                                            <p className="font-extrabold text-gray-900 dark:text-white">#{order.orderId}</p>
                                            <p className="text-xs text-gray-400 font-bold mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="py-4 px-2 font-bold text-gray-700 dark:text-gray-300">{order.customerName}</td>
                                        <td className="py-4 px-2 font-extrabold text-gray-900 dark:text-white">Rs. {order.totalAmount}</td>
                                        <td className="py-4 px-2">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                                order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                                                    order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                                                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                                }`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Top Restaurants</h2>
                        <Link to="/admin/restaurants" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Manage</Link>
                    </div>
                    <div className="space-y-4">
                        {topRestaurants.length === 0 ? (
                            <p className="text-center py-4 text-gray-500 dark:text-gray-400 font-bold">No top restaurants found.</p>
                        ) : topRestaurants.map((restaurant, i) => (
                            <div key={restaurant._id} className="flex items-center gap-4 group cursor-pointer p-3 -mx-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center font-extrabold text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                                    #{i + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-extrabold text-gray-900 dark:text-white tracking-tight group-hover:text-primary-600 transition-colors">{restaurant.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{restaurant.category}</span>
                                        <span className="text-xs font-extrabold text-yellow-500">★ {restaurant.rating || 'N/A'}</span>
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

export default AdminDashboard;
