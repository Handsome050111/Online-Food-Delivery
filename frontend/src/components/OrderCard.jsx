import React from 'react';
import { Package, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const OrderCard = ({ order }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'preparing': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'on the way': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    const handleReorder = () => {
        if (!order || !order.items) return;
        
        order.items.forEach(item => {
            const itemPrice = item.price || (order.totalAmount / (order.items.length || 1));
            addToCart({ 
                _id: item.id || `reorder-${Date.now()}`, 
                name: item.name, 
                price: itemPrice,
                image: order.restaurantImage || order.image
            }, { 
                _id: order.restaurant || order.restaurantId, 
                name: order.restaurantName, 
                deliveryFee: order.deliveryFee || 0
            });
        });
        toast.success(`Items from ${order.restaurantName} added to cart`);
        navigate('/cart');
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                        <img src={order.restaurantImage} alt={order.restaurantName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-gray-900 dark:text-white text-lg leading-tight">{order.restaurantName}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Order #{order.id}</p>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                        {order.status}
                    </span>
                    <span className="font-extrabold text-gray-900 dark:text-white mt-2">Rs. {order.total.toFixed(0)}</span>
                </div>
            </div>

            <div className="py-2 space-y-2 mb-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-medium"><span className="text-gray-900 dark:text-white font-bold">{item.qty}x</span> {item.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                        <Calendar size={16} />
                        {order.date}
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => toast("Live tracking module coming soon!", { icon: '🗺️' })} className="flex-1 sm:flex-none text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold py-2 px-4 rounded-lg transition-colors">
                        Track Details
                    </button>
                    <button onClick={handleReorder} className="flex-1 sm:flex-none bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Reorder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
