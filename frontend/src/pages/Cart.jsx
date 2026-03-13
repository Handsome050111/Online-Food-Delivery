import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tag, ShoppingBag } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart } = useCart();
    const cartItems = cart.items || [];

    const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    const deliveryFee = cart.restaurant ? (cart.restaurant.deliveryFee || 0) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link to="/restaurants" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors font-bold mb-4">
                        <ArrowLeft size={18} />
                        Back to restaurants
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <ShoppingBag className="text-primary-500" size={36} />
                        Your Cart
                    </h1>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-6">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Order Items</h2>
                                        {cart.restaurant && <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">From {cart.restaurant.name}</p>}
                                    </div>
                                    <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold px-3 py-1 rounded-full text-sm">{cartItems.length} items</span>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-2">
                                    {cartItems.map(item => (
                                        <CartItem key={item.cartId || item._id} item={item} />
                                    ))}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">Special Instructions</h3>
                                <textarea
                                    rows="3"
                                    placeholder="E.g. No onions, extra ketchup, ring the doorbell..."
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 resize-none transition-all"
                                ></textarea>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 sticky top-24">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                                <div className="flex bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 mb-6 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 transition-all">
                                    <div className="pl-4 flex items-center text-gray-400 dark:text-gray-500">
                                        <Tag size={18} />
                                    </div>
                                    <input type="text" placeholder="Promo code" className="w-full bg-transparent border-none focus:outline-none px-3 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder-gray-400" />
                                    <button className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors active:scale-95">Apply</button>
                                </div>

                                <div className="space-y-4 pb-6 border-b border-dashed border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900 dark:text-white">Rs. {subtotal.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                                        <span>Delivery Fee</span>
                                        <span className="text-gray-900 dark:text-white">Rs. {deliveryFee.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                                        <span>Tax</span>
                                        <span className="text-gray-900 dark:text-white">Rs. {tax.toFixed(0)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-6">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">Rs. {total.toFixed(0)}</span>
                                </div>

                                <Link to="/checkout" className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-center py-4.5 rounded-xl transition-all shadow-md active:scale-95 text-lg">
                                    Proceed to Checkout
                                </Link>
                                <p className="text-center text-xs font-medium text-gray-400 mt-4">Taxes and delivery fees are calculated above.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">Looks like you haven't added anything to your cart yet. Explore our top restaurants to find something delicious.</p>
                        <Link to="/restaurants" className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 text-lg">
                            Browse Restaurants
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
