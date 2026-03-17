import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../context/LocationContext';
import { getCityCoordinates } from '../utils/mapUtils';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import Chat from '../components/Chat';

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;
const RiderActiveTask = () => {
    const { city } = useLocation();
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const socket = useSocket();

    const fetchActiveTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders/rider');
            // Filter strictly for orders assigned to this rider that aren't finished or cancelled
            const data = Array.isArray(res.data) ? res.data : (res.data?.success ? res.data.data : []);
            const active = Array.isArray(data) ? data.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing') : [];
            setActiveOrders(active);
        } catch (error) {
            console.error("Error fetching active tasks:", error);
            toast.error("Failed to load active tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveTasks();

        let watchId;
        if (socket && navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const location = [position.coords.latitude, position.coords.longitude];
                // Emit location for each active order so relevant customers get updates
                activeOrders.forEach(order => {
                    socket.emit('update_location', {
                        orderId: order._id,
                        location
                    });
                });
            }, (err) => console.error("Location error:", err), {
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [socket, activeOrders.length]);

    const completeOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: 'delivered' });
            toast.success("Delivery marked as completed!");
            fetchActiveTasks(); // Refresh the list
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update delivery status");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-bold">Loading active tasks...</div>;
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Active Tasks</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">Manage your current deliveries</p>
            </div>

            {activeOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
                    <Navigation size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Deliveries</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Head back to the dashboard to find available runs.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {activeOrders.map(order => (
                        <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="bg-blue-600 dark:bg-blue-700 p-4 sm:p-6 text-white flex justify-between items-start">
                                <div>
                                    <span className="bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 inline-block">Order Run</span>
                                    <h3 className="text-xl font-extrabold">{order.restaurantName}</h3>
                                    <p className="text-blue-100 dark:text-blue-200 font-medium mt-1">Order #{order.orderId}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-extrabold">Rs. {order.totalAmount.toFixed(2)}</span>
                                    <p className="text-blue-100 dark:text-blue-200 text-sm font-medium">{order.items?.length || 0} Items</p>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 text-orange-600 dark:text-orange-400">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Pickup Location</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{order.restaurantName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="ml-5 border-l-2 border-dashed border-gray-200 dark:border-gray-800 h-8"></div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                                                <Navigation size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Delivery Drop-off</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:w-64 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col justify-between">
                                        <div className="space-y-3 mb-6">
                                            <h4 className="font-bold text-gray-900 dark:text-white">Customer Details</h4>
                                        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
                                            <MapContainer center={getCityCoordinates(city)} zoom={14} style={{ height: '100%', width: '100%' }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={getCityCoordinates(city)}>
                                                    <Popup>Restaurant: {order.restaurantName}</Popup>
                                                </Marker>
                                                <Marker position={[getCityCoordinates(city)[0] + 0.01, getCityCoordinates(city)[1] + 0.01]}>
                                                    <Popup>Customer: {order.customerName}</Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {order.user && order.user.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} />
                                                    <span className="font-bold text-gray-900 dark:text-white">{order.user.phone}</span>
                                                </div>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    setActiveOrderId(order._id);
                                                    setIsChatOpen(true);
                                                }}
                                                className="text-primary-600 dark:text-primary-400 font-black flex items-center gap-1.5 hover:underline"
                                            >
                                                <MessageSquare size={16} />
                                                Message Customer
                                            </button>
                                        </div>
                                        </div>
                                        
                                        <Chat 
                                            orderId={activeOrderId} 
                                            recipientName={order.customerName || "Customer"} 
                                            isOpen={isChatOpen && activeOrderId === order._id} 
                                            onClose={() => setIsChatOpen(false)} 
                                        />

                                        <button 
                                            onClick={() => completeOrder(order._id)}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-green-500/20"
                                        >
                                            <CheckCircle2 size={20} />
                                            Mark as Delivered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderActiveTask;
