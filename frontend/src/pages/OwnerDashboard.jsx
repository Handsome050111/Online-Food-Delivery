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
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        categories: '',
        address: '',
        deliveryTime: '',
        deliveryFee: '',
        image: ''
    });

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/restaurants/my-restaurant');
            if (data.success) {
                setRestaurant(data.data);
                setEditData({
                    name: data.data.name,
                    categories: Array.isArray(data.data.categories) ? data.data.categories.join(', ') : data.data.categories,
                    address: data.data.address,
                    deliveryTime: data.data.deliveryTime,
                    deliveryFee: data.data.deliveryFee,
                    image: data.data.image
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const handleUpdateRestaurant = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editData,
                categories: editData.categories.split(',').map(c => c.trim())
            };
            const { data } = await api.put('/restaurants/my-restaurant', payload);
            if (data.success) {
                toast.success('Restaurant updated successfully!');
                setRestaurant(data.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating restaurant:", error);
            toast.error(error.response?.data?.message || 'Failed to update restaurant');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // For now, we simulate upload by converting to base64 or using a placeholder
            // In a real app, this would upload to S3/Cloudinary and return a URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, image: reader.result });
                toast.success('Image ready for update!');
            };
            reader.readAsDataURL(file);
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
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2 rounded-xl font-black tracking-tight transition-all active:scale-95 shadow-sm ${isEditing ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : 'bg-primary-500 text-white shadow-primary-500/20 shadow-lg'}`}
                    >
                        {isEditing ? 'Cancel Editing' : 'Edit Restaurant'}
                    </button>
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3.5 py-2 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500"></div>
                        <span className="text-sm font-bold tracking-wide uppercase">Active</span>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 mb-10 animate-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Update Restaurant Details</h2>
                    <form onSubmit={handleUpdateRestaurant} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Restaurant Name</label>
                                <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white" required />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Categories (comma separated)</label>
                                <input type="text" value={editData.categories} onChange={(e) => setEditData({...editData, categories: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white" placeholder="Pizza, Italian, Fast Food" required />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Physical Address</label>
                                <input type="text" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Deliv. Time (min)</label>
                                    <input type="text" value={editData.deliveryTime} onChange={(e) => setEditData({...editData, deliveryTime: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Deliv. Fee (Rs)</label>
                                    <input type="number" value={editData.deliveryFee} onChange={(e) => setEditData({...editData, deliveryFee: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white" required />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Restaurant Display Banner</label>
                            <div className="flex-1 relative group cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-primary-500 transition-colors">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                {editData.image ? (
                                    <img src={editData.image} alt="Restaurant" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                                        <ShoppingBag className="text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Click or Drag to Upload Image</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black uppercase tracking-widest text-xs">
                                     Change Image
                                </div>
                            </div>
                            <button type="submit" className="mt-6 bg-primary-500 hover:bg-primary-600 text-white font-black py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-primary-500/20">
                                Save All Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 font-mono text-sm leading-tight">
                        {recentOrders.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-8">No recent orders yet.</p>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order._id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center group hover:border-primary-500 transition-colors cursor-pointer">
                                    <div>
                                        <p className="font-extrabold text-gray-900 dark:text-white">ORDER #{order.orderId.slice(-6)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">{order.customerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 dark:text-white">Rs. {order.totalAmount}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${order.status === 'delivered' ? 'text-green-500' : 'text-primary-500'}`}>{order.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Popular Menu Items</h2>
                        <button onClick={() => navigate('/owner/menu')} className="text-sm font-black text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest">Edit Menu</button>
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
