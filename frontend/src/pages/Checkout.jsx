import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Truck, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setOrderPlaced(true);
        setTimeout(() => {
            navigate('/orders');
        }, 3000);
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" defaultValue="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" defaultValue="House 123, Street 4, F-8, Islamabad" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" defaultValue="+92 300 1234567" />
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

                            <div className="space-y-4 pb-6 border-b border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gray-100 rounded-lg p-2 font-bold text-sm">1x</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Classic Cheeseburger</h4>
                                        <span className="text-gray-500 text-sm font-medium">Rs. 1299</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-gray-100 rounded-lg p-2 font-bold text-sm">2x</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Truffle Fries</h4>
                                        <span className="text-gray-500 text-sm font-medium">Rs. 1398</span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-6 space-y-3 border-b border-dashed border-gray-200">
                                <div className="flex justify-between text-gray-500 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">Rs. 2697</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium text-sm">
                                    <span>Delivery Fee</span>
                                    <span className="text-gray-900">Rs. 250</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium text-sm">
                                    <span>Tax</span>
                                    <span className="text-gray-900">Rs. 216</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-6">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-extrabold text-primary-600">Rs. 3163</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 text-lg flex items-center justify-center gap-2"
                            >
                                Place Order <Truck size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
