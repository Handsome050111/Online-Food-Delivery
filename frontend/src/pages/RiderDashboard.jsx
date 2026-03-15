import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bike, Navigation, CheckCircle2, DollarSign, MapPin, RefreshCw } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const RiderDashboard = () => {
    const location = useLocation();
    const socket = useSocket();
    const isAvailableView = location.pathname.includes('/available');
    const [isOnline, setIsOnline] = useState(false);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRiderData = async () => {
        try {
            setLoading(true);
            const userRes = await api.get('/users/profile');
            setIsOnline(userRes.data.isAvailable || false);
            
            const ordersRes = await api.get('/orders/available');
            setAvailableOrders(ordersRes.data);
        } catch (error) {
            console.error("Error fetching rider data:", error);
            // toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiderData();

        if (socket) {
            socket.on('available_order', (newOrder) => {
                if (isOnline) {
                    toast.success(`New order available: ${newOrder.restaurantName}`, { icon: '🚴' });
                    setAvailableOrders(prev => [newOrder, ...prev]);
                }
            });

            return () => socket.off('available_order');
        }
    }, [isOnline, socket]);

    const toggleStatus = async () => {
        try {
            const res = await api.put('/users/availability', {});
            setIsOnline(res.data.isAvailable);
            
            // Update local storage so next login remembers
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            userInfo.isAvailable = res.data.isAvailable;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            if (res.data.isAvailable) {
                 toast.success("You are now online and ready for deliveries!");
                 fetchRiderData();
            } else {
                 toast("You are now offline.", { icon: '🌙' });
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Failed to change availability status");
        }
    };

    const handleAcceptOrder = async (orderId) => {
         try {
              if (!isOnline) {
                  return toast.error("You must be online to accept orders!");
              }
              await api.put(`/orders/${orderId}/accept`);
              toast.success("Order accepted! (Active Task integration coming soon)");
              setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
         } catch (error) {
              console.error("Error accepting order:", error);
              toast.error(error.response?.data?.message || "Failed to accept order");
         }
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap justify-between items-end gap-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {isAvailableView ? 'Available Runs' : 'Rider Overview'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">
                        {isAvailableView ? 'Find your next delivery below' : 'Looking for deliveries today?'}
                    </p>
                </div>
                <button 
                    onClick={toggleStatus}
                    className={`${isOnline ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/20'} text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2.5`}
                >
                    <div className={`w-2.5 h-2.5 bg-white rounded-full ${isOnline ? 'animate-pulse' : ''} shadow-sm`}></div>
                    {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>

            {!isAvailableView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Today's Earnings" value="Rs. 0.00" icon={DollarSign} colorClass="text-green-600 bg-green-100" />
                    <StatsCard title="Deliveries Done" value="0" icon={CheckCircle2} colorClass="text-blue-600 bg-blue-100" />
                    <StatsCard title="Active Time" value="0h 0m" icon={Bike} colorClass="text-purple-600 bg-purple-100" />
                    <StatsCard title="Total Distance" value="0 km" icon={Navigation} colorClass="text-orange-600 bg-orange-100" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {!isAvailableView && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:row-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Live Navigation</h2>
                            <span className={`${isOnline ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'} text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                             <div className="text-center">
                                  <Navigation size={40} className={`mx-auto mb-3 ${isOnline ? 'text-primary-500' : 'text-gray-600 dark:text-gray-500'}`} />
                                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Map initialization required</p>
                             </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Available Orders</h2>
                        <button onClick={fetchRiderData} disabled={loading} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-8">Loading...</p>
                        ) : !isOnline ? (
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-8">Go online to see available deliveries.</p>
                        ) : availableOrders.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-8">No deliveries available right now.</p>
                        ) : (
                            availableOrders.map(order => (
                                <div key={order._id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-800/50 flex flex-col gap-3">
                                     <div className="flex justify-between items-start">
                                          <div>
                                               <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md border border-transparent dark:border-blue-800">#{order.orderId || order._id.slice(-6).toUpperCase()}</span>
                                               <h3 className="font-extrabold text-gray-900 dark:text-white mt-1">{order.restaurantName}</h3>
                                          </div>
                                          <span className="font-extrabold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg border border-transparent dark:border-green-800">Rs. {(order.totalAmount || 0).toFixed(2)}</span>
                                     </div>
                                     <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                          <MapPin size={16} className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                                          <p className="line-clamp-2">{order.deliveryAddress}</p>
                                     </div>
                                     <div className="pt-2 mt-1 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{order.items?.length || 0} items</span>
                                          <button 
                                               onClick={() => handleAcceptOrder(order._id)}
                                               className="bg-gray-900 dark:bg-primary-600 hover:bg-gray-800 dark:hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
                                          >
                                               Accept Run
                                          </button>
                                     </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
