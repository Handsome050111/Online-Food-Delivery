import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, DollarSign, TrendingUp, Check, X, ShieldAlert } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [userContext, setUserContext] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [stats, setStats] = useState({
        todaySales: 0,
        ordersToday: 0,
        averageRating: 0.0,
        monthlyRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/restaurants/my-restaurant');
            if (data.success) {
                setRestaurant(data.data);
            }
            
            // In a real app, we'd fetch actual stats here
            // const ordersRes = await api.get('/orders?restaurant=' + data.data._id);
            // setRecentOrders(ordersRes.data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUserContext(userInfo);
        }
    }, []);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const { data } = await api.get('/users/profile');
                if (data.status === 'active') {
                    const updatedInfo = { ...userContext, status: 'active' };
                    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
                    setUserContext(updatedInfo);
                }
            } catch (error) {
                console.error("Error checking user status:", error);
            }
        };

        if (userContext) {
            if (userContext.status === 'pending') {
                checkUserStatus();
            } else {
                fetchDashboardData();
            }
        }
    }, [userContext]);

    useEffect(() => {
        if (socket) {
            socket.on('new_order', (order) => {
                toast.success('New order received!', { duration: 5000 });
                setRecentOrders(prev => [order, ...prev.slice(0, 4)]);
                setStats(prev => ({ ...prev, ordersToday: (prev.ordersToday || 0) + 1 }));
            });

            socket.on('rider_assigned', (order) => {
                toast(`Rider assigned to order #${order.orderId}`, { icon: '🛵' });
                fetchDashboardData();
            });

            return () => {
                socket.off('new_order');
                socket.off('rider_assigned');
            };
        }
    }, [socket]);

    if (userContext?.status === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200 dark:border-orange-800">
                    <ShieldAlert size={48} className="text-orange-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Account Under Verification</h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                    Welcome, {userContext.name}! Your partner application is currently being reviewed by our administration team.
                    Once approved, your restaurant dashboard will be unlocked and you can start receiving orders.
                </p>
                <div className="mt-8 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl border border-orange-200 dark:border-orange-800 font-bold text-sm shadow-sm inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    Status: Pending Admin Approval
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{restaurant ? restaurant.name : `${userContext?.name}'s Dashboard`}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">Manage your restaurant operations from here.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3.5 py-1.5 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500"></div>
                    <span className="text-sm font-bold tracking-wide">ACCEPTING ORDERS</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Today's Sales" value={`Rs ${stats.todaySales}`} icon={DollarSign} colorClass="text-green-600 bg-green-100" />
                <StatsCard title="Orders Today" value={stats.ordersToday} icon={ShoppingBag} colorClass="text-blue-600 bg-blue-100" />
                <StatsCard title="Average Rating" value={stats.averageRating} icon={Star} colorClass="text-amber-500 bg-amber-100" />
                <StatsCard title="Revenue (Month)" value={`Rs ${stats.monthlyRevenue}`} icon={TrendingUp} colorClass="text-purple-600 bg-purple-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                            Recent Orders
                        </h2>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {recentOrders.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-8">No recent orders yet.</p>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order._id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">#{order.orderId}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{order.customerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-600">Rs. {order.totalAmount}</p>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Popular Menu Items</h2>
                        <button onClick={() => navigate('/owner/menu')} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Edit Menu</button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-8">No menu analytics available.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
