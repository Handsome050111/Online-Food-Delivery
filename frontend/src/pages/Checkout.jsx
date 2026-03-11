import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    
    // Delivery form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: ''
    });

    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    // Calculate totals
    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cartItems.length > 0 ? (cart?.restaurant?.deliveryFee || 250) : 0;
    const tax = Math.round(subtotal * 0.08); // 8% tax example
    const totalAmount = subtotal + deliveryFee + tax;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!userInfo) {
            toast.error('You must be logged in to place an order');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (!formData.address || !formData.phone || !formData.firstName) {
            setError('Please fill in all required delivery details (First Name, Address, Phone)');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const orderPayload = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                deliveryAddress: `${formData.address} (Contact: ${formData.phone})`,
                paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery',
                totalAmount: totalAmount,
                restaurantId: cart.restaurant?._id,
                restaurantName: cart.restaurant?.name
            };

            await api.post('/orders', orderPayload);
            
            clearCart();
            setOrderPlaced(true);
            
            setTimeout(() => {
                navigate('/orders');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-8 font-medium">Your delicious food is being prepared and will be with you shortly.</p>
                    <div className="animate-pulse bg-gray-100 h-2 w-full rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-1/3 rounded-full transition-all duration-1000 ease-out"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 font-bold uppercase tracking-wider">Redirecting to orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                <MapPin className="text-primary-500" />
                                Delivery Details
                            </h2>
                            <form className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100 mb-4">
                                        <AlertCircle size={20} />
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label>
                                        <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                        <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Address *</label>
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="House 123, Street 4, Islamabad" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="+92 300 1234567" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Payment Method</h2>
                            <div className="space-y-4">
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300'}`}>
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300" />
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded shadow-sm">
                                            <CreditCard className="text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900 block">Credit or Debit Card</span>
                                            <span className="text-xs text-gray-500 font-medium">Visa, Mastercard, AMEX</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300'}`}>
                                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300" />
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded shadow-sm">
                                            <Banknote className="text-green-600" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900 block">Cash on Delivery</span>
                                            <span className="text-xs text-gray-500 font-medium">Pay when your food arrives</span>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="mt-6 space-y-4 animate-in fade-in duration-300 slide-in-from-top-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono tracking-widest" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date</label>
                                            <input type="text" placeholder="MM/YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono tracking-widest" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">CVC</label>
                                            <input type="text" placeholder="123" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono tracking-widest" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Summary</h2>

                            <div className="space-y-4 pb-6 border-b border-gray-100 max-h-[40vh] overflow-y-auto">
                                {cartItems.length > 0 ? cartItems.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="bg-gray-100 rounded-lg p-2 font-bold text-sm">{item.quantity}x</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <span className="text-gray-500 text-sm font-medium">Rs. {item.price}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 italic">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="py-6 space-y-3 border-b border-dashed border-gray-200">
                                <div className="flex justify-between text-gray-500 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium text-sm">
                                    <span>Delivery Fee</span>
                                    <span className="text-gray-900">Rs. {deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium text-sm">
                                    <span>Tax (8%)</span>
                                    <span className="text-gray-900">Rs. {tax}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-6">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-extrabold text-primary-600">Rs. {totalAmount}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || cartItems.length === 0}
                                className={`w-full ${isProcessing || cartItems.length === 0 ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 active:scale-95'} text-white font-bold py-4 rounded-xl transition-all shadow-md text-lg flex items-center justify-center gap-2`}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'} {!isProcessing && <Truck size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
