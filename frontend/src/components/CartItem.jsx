import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b border-gray-100 last:border-0 group">
            <div className="w-full sm:w-24 h-48 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-grow flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-extrabold text-gray-900 text-lg sm:text-base leading-tight pr-4">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 -mr-2 -mt-2 rounded-full transition-colors flex-shrink-0">
                        <Trash2 size={18} />
                    </button>
                </div>
                <div className="flex justify-between items-end mt-auto">
                    <p className="text-primary-600 font-extrabold text-lg">Rs. {(item.price || 0).toFixed(0)}</p>
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary-600 active:scale-95 transition-transform focus:outline-none">
                            <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="font-bold text-gray-900 min-w-[1rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary-600 active:scale-95 transition-transform focus:outline-none">
                            <Plus size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
