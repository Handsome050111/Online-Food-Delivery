import React, { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, Settings, LogOut, Package, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '', email: '', phone: '', address: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '', password: '', confirmPassword: ''
    });
    
    const [passError, setPassError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile', {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setProfileData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data } = await api.put('/users/profile', profileData, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            
            // Update local storage explicitly
            const updatedUserInfo = { ...userInfo, name: data.name, email: data.email };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPassError('');

        if (passwordData.password !== passwordData.confirmPassword) {
            setPassError("New passwords do not match");
            return;
        }

        setIsSaving(true);
        try {
            await api.put('/users/profile', {
                currentPassword: passwordData.currentPassword,
                password: passwordData.password
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            
            toast.success("Password updated successfully!");
            setPasswordData({ currentPassword: '', password: '', confirmPassword: '' });
        } catch (error) {
            setPassError(error.response?.data?.message || "Failed to update password");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                <p className="text-gray-500 font-medium ml-4">Loading profile...</p>
            </div>
        );
    }
    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
                            <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold uppercase">
                                {profileData.name ? profileData.name.substring(0, 2) : 'JD'}
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900">{profileData.name || 'User Name'}</h2>
                            <p className="text-gray-500 text-sm font-medium">{profileData.email || 'Email missing'}</p>
                        </div>

                        <nav className="space-y-2">
                            <Link to="/profile" className="flex items-center gap-3 bg-primary-50 text-primary-600 font-bold px-4 py-3 rounded-xl transition-colors">
                                <User size={20} />
                                Personal Info
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors">
                                <Package size={20} />
                                My Orders
                            </Link>
                            <button onClick={() => toast("Saved Addresses coming in next update!", { icon: '🚧' })} className="flex w-full items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors text-left">
                                <MapPin size={20} />
                                Saved Addresses
                            </button>
                            <button onClick={() => toast("Payment Methods coming in next update!", { icon: '🚧' })} className="flex w-full items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors text-left">
                                <CreditCard size={20} />
                                Payment Methods
                            </button>
                            <button onClick={() => toast("Settings coming in next update!", { icon: '🚧' })} className="flex w-full items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3 rounded-xl transition-colors text-left">
                                <Settings size={20} />
                                Settings
                            </button>
                            <button onClick={handleLogout} className="flex w-full items-center gap-3 text-red-500 hover:bg-red-50 font-bold px-4 py-3 rounded-xl transition-colors text-left mt-8">
                                <LogOut size={20} />
                                Logout
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
                            <form onSubmit={handleProfileSubmit} className="space-y-6 border-b border-gray-100 pb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                                        <textarea value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" rows="2"></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={isSaving} className={`bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>

                            {/* Password Section */}
                            <div className="pt-8">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Change Password</h2>
                                {passError && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100 mb-6">
                                        <AlertCircle size={20} />
                                        {passError}
                                    </div>
                                )}
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                                        <input type="password" required minLength="6" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                        <input type="password" required minLength="6" value={passwordData.password} onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                        <input type="password" required minLength="6" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium" />
                                    </div>
                                    <div className="flex justify-start pt-2">
                                        <button type="submit" disabled={isSaving} className={`bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                            {isSaving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
