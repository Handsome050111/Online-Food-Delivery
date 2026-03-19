import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetData, setResetData] = useState({ token: '', newPassword: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password, rememberMe });

            // Store user info in localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Execute programmatic dashboard switch immediately on memory load
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'rider') navigate('/rider');
            else if (data.role === 'owner') navigate('/owner');
            else navigate('/');
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email first to reset password');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            toast.success('Reset token generated! (Check console for dev)');
            setShowResetForm(true); // Show reset form after getting token
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, ...resetData });
            toast.success('Password reset successfully! You can now login.');
            setShowResetForm(false);
            setResetData({ token: '', newPassword: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // Read query parameters for email pre-filling or provider hints
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const providerParam = params.get('provider');
        
        if (emailParam) {
            setEmail(emailParam);
        }
        
        if (providerParam) {
            toast(`Continuing with ${providerParam[0].toUpperCase() + providerParam.slice(1)}...`, {
                icon: '🔑',
            });
        }
    }, []);

    // Auto-redirect if user hits the back button to /login but is still logged in
    React.useEffect(() => {
        const userInfoContext = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfoContext) {
             const params = new URLSearchParams(window.location.search);
             const redirect = params.get('redirect') || '/';
             
             if (userInfoContext.role === 'admin' && !redirect.includes('checkout')) navigate('/admin');
             else if (userInfoContext.role === 'rider' && !redirect.includes('checkout')) navigate('/rider');
             else if (userInfoContext.role === 'owner' && !redirect.includes('checkout')) navigate('/owner');
             else navigate(redirect);
        }
    }, [navigate]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Enter your credentials to access your account
                    </p>
                </div>
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100 dark:border-red-900/30">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-400 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <button 
                                type="button"
                                onClick={handleForgotPassword}
                                className="font-bold text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md shadow-primary-500/20`}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>

                {showResetForm && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reset Password</h3>
                            <button onClick={() => setShowResetForm(false)} className="text-xs text-gray-500 hover:text-gray-700 font-bold uppercase transition-colors">Cancel</button>
                        </div>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Reset Token</label>
                                <input
                                    type="text"
                                    required
                                    value={resetData.token}
                                    onChange={(e) => setResetData({ ...resetData, token: e.target.value.toUpperCase() })}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all sm:text-sm uppercase font-black tracking-widest"
                                    placeholder="ENTER TOKEN"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={resetData.newPassword}
                                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all sm:text-sm"
                                    placeholder=" 최소 6자 이상"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md active:scale-[0.98]"
                            >
                                {loading ? 'Resetting...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                )}

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
                        Sign up now
                    </Link>
                </p>

                <div className="mt-6 flex justify-center gap-4 text-sm font-bold text-gray-500 dark:text-gray-500">
                    <Link to="/partner" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                        Partner with us
                    </Link>
                    <span>&bull;</span>
                    <Link to="/rider-registration" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                        Ride for us
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
