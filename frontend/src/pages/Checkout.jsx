import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    const [emailInput, setEmailInput] = useState('');
    
    // Delivery form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: ''
    });

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 11) {
            setFormData({ ...formData, phone: val });
        }
    };

    const handleCardChange = (e, field, max) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= max) {
            setCardDetails({ ...cardDetails, [field]: val });
        }
    };

    const formatCardNumber = (num) => {
        return num.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiry = (exp) => {
        if (exp.length <= 2) return exp;
        return exp.slice(0, 2) + '/' + exp.slice(2, 4);
    };

    const navigate = useNavigate();
    const location = useLocation();

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    // Calculate totals
    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cartItems.length > 0 ? (cart?.restaurant?.deliveryFee || 250) : 0;
    const tax = Math.round(subtotal * 0.08); // 8% tax example
    
    // Coupon logic
    const discount = cart.coupon ? cart.coupon.discountAmount : 0;
    const totalAmount = subtotal + deliveryFee + tax - discount;

    const handleSocialLogin = (provider) => {
        // Redirect to actual backend OAuth endpoints
        // Note: Backend setup with Client ID/Secrets is required for this to be fully functional
        toast.loading(`Connecting to ${provider}...`, { duration: 3000 });
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${apiUrl}/auth/${provider}`;
    };

    const handleEmailContinue = async (e) => {
        if (e) e.preventDefault();
        
        if (!emailInput) {
            toast.error('Please enter your email address to continue');
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Proactively check if email exists to decide between login or signup
        try {
            // We'll redirect to login page with the email pre-filled
            // The user asked "it must ask user to enter email to continue" 
            // but they ALREADY entered it. I think they want a smooth transition.
            navigate(`/login?email=${encodeURIComponent(emailInput)}&redirect=/checkout`);
        } catch (err) {
            navigate(`/login?email=${encodeURIComponent(emailInput)}&redirect=/checkout`);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!userInfo) {
            toast.error('You must be logged in to place an order');
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
                restaurantName: cart.restaurant?.name,
                couponCode: cart.coupon?.code,
                discountAmount: discount
            };

            const { data: createdOrder } = await api.post('/orders', orderPayload);
            
            clearCart();
            setOrderPlaced(true);
            
            setTimeout(() => {
                navigate(`/order-tracking/${createdOrder._id}`);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-in zoom-in duration-500 border border-gray-100 dark:border-gray-800">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Order Placed!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Your delicious food is being prepared and will be with you shortly.</p>
                    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-2 w-full rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-1/3 rounded-full transition-all duration-1000 ease-out"></div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 font-bold uppercase tracking-wider">Redirecting to orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {userInfo ? (
                            <>
                                {/* Delivery Details */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <MapPin className="text-primary-500" />
                                        Delivery Details
                                    </h2>
                                    <form className="space-y-4">
                                        {error && (
                                            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100 dark:border-red-900/30 mb-4">
                                                <AlertCircle size={20} />
                                                {error}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                                                <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="John" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                                <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="Doe" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Address *</label>
                                            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="House 123, Street 4, Islamabad" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                                            <input type="tel" value={formData.phone} onChange={handlePhoneChange} className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="03001234567" />
                                        </div>
                                    </form>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in slide-in-from-left-4 duration-700">
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Payment Method</h2>
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-primary-300'}`}>
                                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700" />
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
                                                    <CreditCard className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 dark:text-white block">Credit or Debit Card</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Visa, Mastercard, AMEX</span>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-primary-300'}`}>
                                            <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700" />
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
                                                    <Banknote className="text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 dark:text-white block">Cash on Delivery</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pay when your food arrives</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="mt-6 space-y-4 animate-in fade-in duration-300 slide-in-from-top-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                                                <input type="text" value={formatCardNumber(cardDetails.number)} onChange={(e) => handleCardChange(e, 'number', 16)} placeholder="0000 0000 0000 0000" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono tracking-widest" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                                                    <input type="text" value={formatExpiry(cardDetails.expiry)} onChange={(e) => handleCardChange(e, 'expiry', 4)} placeholder="MM/YY" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono tracking-widest" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                                                    <input type="password" value={cardDetails.cvc} onChange={(e) => handleCardChange(e, 'cvc', 3)} placeholder="123" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono tracking-widest" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Almost There UI inside Delivery Details area */
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
                                <h2 className="text-[32px] sm:text-[40px] font-black text-gray-900 dark:text-white mb-2 leading-none">Almost there</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 text-lg">Sign up or log in to continue</p>
                                
                                <div className="space-y-4 mb-10">
                                    <button 
                                        onClick={() => handleSocialLogin('facebook')}
                                        className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-md shadow-blue-500/20"
                                    >
                                        <span className="text-lg">Continue with Facebook</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleSocialLogin('google')}
                                        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        <span className="text-lg text-gray-600 font-bold">Continue with Google</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleSocialLogin('apple')}
                                        className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-md shadow-black/20"
                                    >
                                        <span className="text-lg">Continue with Apple</span>
                                    </button>
                                </div>
                                
                                <div className="relative flex items-center justify-center mb-10">
                                    <div className="border-t border-gray-100 dark:border-gray-800 w-full"></div>
                                    <span className="absolute bg-white dark:bg-gray-900 px-6 text-gray-400 dark:text-gray-500 font-bold text-sm uppercase tracking-widest">or</span>
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="block text-gray-700 dark:text-gray-300 font-extrabold text-lg">Enter your email address to login / signup</label>
                                    <div className="flex gap-3">
                                        <input 
                                            type="email" 
                                            placeholder="Email" 
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleEmailContinue()}
                                            className="flex-grow bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-[18px] px-6 py-5 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-all text-lg shadow-inner"
                                        />
                                        <button 
                                            onClick={handleEmailContinue}
                                            className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 p-5 rounded-[18px] flex items-center justify-center aspect-square transition-all hover:bg-primary-500 hover:text-white group"
                                        >
                                            <svg className="w-8 h-8 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed font-medium">
                                    By signing up, you agree to our <Link to="/terms" className="text-[#DE1161] font-bold hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-[#DE1161] font-bold hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 sticky top-24">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Summary</h2>

                            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-800 max-h-[40vh] overflow-y-auto">
                                {cartItems.length > 0 ? cartItems.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 font-bold text-sm text-gray-900 dark:text-white">{item.quantity}x</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Rs. {item.price}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 dark:text-gray-400 italic">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="py-6 space-y-3 border-b border-dashed border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    <span>Delivery Fee</span>
                                    <span className="text-gray-900 dark:text-white">Rs. {deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    <span>Tax (8%)</span>
                                    <span className="text-gray-900 dark:text-white">Rs. {tax}</span>
                                </div>
                                {cart.coupon && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400 font-bold text-sm">
                                        <span>Discount ({cart.coupon.code})</span>
                                        <span>-Rs. {discount}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center py-6">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">Rs. {totalAmount}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || cartItems.length === 0 || !userInfo}
                                className={`w-full ${isProcessing || cartItems.length === 0 || !userInfo ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 active:scale-95 shadow-lg shadow-primary-500/30'} text-white font-black py-5 rounded-2xl transition-all text-xl flex items-center justify-center gap-2`}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'} {!isProcessing && <Truck size={24} />}
                            </button>
                            
                            {!userInfo && (
                                <p className="mt-4 text-xs text-primary-600 dark:text-primary-400 text-center font-bold animate-pulse">
                                    Login to complete your order
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
