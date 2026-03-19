import React, { useState, useEffect } from 'react';
import { Tag, Search, Plus, Ticket, AlertCircle, X, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        validUntil: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/coupons?search=${search}&status=${filterStatus}`);
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [search, filterStatus]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            await api.post('/coupons', formData);
            setShowModal(false);
            setFormData({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', validUntil: '' });
            fetchCoupons();
            toast.success("Coupon created successfully");
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create coupon');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.put(`/coupons/${id}/toggle`);
            fetchCoupons();
            toast.success("Coupon status updated");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update coupon status');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Are you sure you want to PERMANENTLY DELETE this coupon?')) {
            try {
                await api.delete(`/coupons/${id}`);
                fetchCoupons();
                toast.success("Coupon permanently deleted");
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete coupon');
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Coupons & Promos</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Create and manage discount codes for customers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create Coupon</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 focus-within:border-primary-400 transition-all mb-6 max-w-md">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search coupons by code..."
                        className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700 dark:text-gray-300 uppercase"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-500 font-bold p-4 col-span-full">Loading coupons...</p>
                    ) : coupons.length === 0 ? (
                        <p className="text-gray-500 font-bold p-4 col-span-full">No coupons found.</p>
                    ) : (
                        coupons.map((coupon) => (
                            <div key={coupon._id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-900 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${coupon.status === 'active' ? 'bg-primary-500' : 'bg-gray-500'}`}></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${coupon.status === 'active' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400' : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                            <Ticket size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-gray-900 dark:text-white tracking-tight text-lg">{coupon.code}</h3>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${coupon.status === 'active' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                                                {coupon.status === 'active' ? 'Active' : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleToggleStatus(coupon._id)}
                                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-bold text-sm"
                                        >
                                            {coupon.status === 'active' ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCoupon(coupon._id)}
                                            className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete Coupon"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Discount</span>
                                        <span className="font-extrabold text-gray-900 dark:text-white text-base">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`} OFF</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Min Order</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">Rs. {coupon.minOrderAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-50 dark:border-gray-800">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Valid Until</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Coupon Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl z-10">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Create New Coupon</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCoupon} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100 dark:border-red-800">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                                    <input type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none uppercase font-bold tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-normal transition-colors" placeholder="SUMMER50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
                                        <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors">
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (Rs.)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Value</label>
                                        <input type="number" required min="1" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="e.g. 20" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Minimum Order Amount (Rs.)</label>
                                    <input type="number" min="0" value={formData.minOrderAmount} onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="e.g. 500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Valid Until</label>
                                    <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.validUntil} onChange={e => setFormData({ ...formData, validUntil: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {formLoading ? 'Saving...' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
