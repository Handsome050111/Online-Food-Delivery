import React, { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, Settings, LogOut, Package, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [profileData, setProfileData] = useState({
        name: '', email: '', phone: '', address: '', avatar: ''
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
                    address: data.address || '',
                    avatar: data.avatar || ''
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imgData = new FormData();
        imgData.append('image', file);
        
        try {
            const uploadPromise = api.post('/upload', imgData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            toast.promise(uploadPromise, {
                loading: 'Uploading avatar...',
                success: 'Avatar ready! Click Save Changes.',
                error: 'Failed to upload avatar.'
            });
            
            const { data } = await uploadPromise;
            setProfileData({ ...profileData, avatar: data.imagePath });
        } catch (error) {
            console.error('Avatar upload failed:', error);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data } = await api.put('/users/profile', profileData, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            
            // Update local storage explicitly
            const updatedUserInfo = { ...userInfo, name: data.name, email: data.email, avatar: data.avatar };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            window.dispatchEvent(new Event('user_updated'));
            
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
            <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center transition-colors duration-300">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium ml-4">Loading profile...</p>
            </div>
        );
    }
    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Profile</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 self-start">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
                            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4 text-3xl font-bold uppercase relative group overflow-hidden border-4 border-white dark:border-gray-900 shadow-sm cursor-pointer hover:border-primary-100 dark:hover:border-primary-900/30 transition-colors">
                                {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    profileData.name ? profileData.name.substring(0, 2) : 'JD'
                                )}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" title="Upload Avatar" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest mt-1">Upload</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{profileData.name || 'User Name'}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{profileData.email || 'Email missing'}</p>
                        </div>

                        <nav className="space-y-2">
                            <button onClick={() => setActiveTab('personal')} className={`flex w-full items-center gap-3 font-bold px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'personal' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
                                <User size={20} />
                                Personal Info
                            </button>
                            <Link to="/orders" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-3 rounded-xl transition-colors">
                                <Package size={20} />
                                My Orders
                            </Link>
                            <button onClick={() => setActiveTab('addresses')} className={`flex w-full items-center gap-3 font-bold px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'addresses' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
                                <MapPin size={20} />
                                Saved Addresses
                            </button>
                            <button onClick={() => setActiveTab('payment')} className={`flex w-full items-center gap-3 font-bold px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'payment' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
                                <CreditCard size={20} />
                                Payment Methods
                            </button>
                            <button onClick={() => setActiveTab('settings')} className={`flex w-full items-center gap-3 font-bold px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'settings' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
                                <Settings size={20} />
                                Settings
                            </button>
                            <button onClick={handleLogout} className="flex w-full items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold px-4 py-3 rounded-xl transition-colors text-left mt-8">
                                <LogOut size={20} />
                                Logout
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-6">
                        {activeTab === 'personal' && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in duration-300">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Personal Information</h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                            <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                            <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                            <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
                                            <textarea value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" rows="2"></textarea>
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
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Change Password</h2>
                                    {passError && (
                                        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100 dark:border-red-900/30 mb-6">
                                            <AlertCircle size={20} />
                                            {passError}
                                        </div>
                                    )}
                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                            <input type="password" required minLength="6" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                            <input type="password" required minLength="6" value={passwordData.password} onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                            <input type="password" required minLength="6" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 font-medium text-gray-900 dark:text-white" />
                                        </div>
                                        <div className="flex justify-start pt-2">
                                            <button type="submit" disabled={isSaving} className={`bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                                {isSaving ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in duration-300">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Saved Addresses</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between p-4 border border-primary-100 dark:border-primary-900/30 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                <MapPin className="text-primary-500" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">Home <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs px-2 py-0.5 rounded-md font-bold">Default</span></h3>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{profileData.address || '123 Main Street, Suite 4A'}</p>
                                                <p className="text-xs text-gray-500 mt-1">Delivery Instructions: Call upon arrival</p>
                                            </div>
                                        </div>
                                        <button className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline">Edit</button>
                                    </div>
                                    <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 font-bold hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
                                        + Add New Address
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in duration-300">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Payment Methods</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-800 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center font-black text-gray-800 dark:text-gray-400 text-xs italic tracking-wider">VISA</div>
                                            <div>
                                                <h3 className="font-extrabold text-gray-900 dark:text-white">•••• •••• •••• 4242</h3>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Expires 12/28</p>
                                            </div>
                                        </div>
                                        <button className="text-red-500 dark:text-red-400 text-sm font-bold hover:underline">Remove</button>
                                    </div>
                                    <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 font-bold hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
                                        + Add New Card
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 animate-in fade-in duration-300">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Account Settings</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-extrabold text-gray-900 dark:text-white">Order Notifications</h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receive push notifications for order updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h3 className="font-extrabold text-gray-900 dark:text-white">Promotional Emails</h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receive offers, discounts, and updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h3 className="font-extrabold text-red-600 dark:text-red-400">Danger Zone</h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Permanently delete your account and data</p>
                                        </div>
                                        <button onClick={() => toast.error("Account deletion requires manual intervention at this time.")} className="px-4 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
