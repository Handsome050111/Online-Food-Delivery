import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users?search=${search}&role=${filterRole}`);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, filterRole]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            await api.post('/users', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'customer' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleSuspendUser = async (id) => {
        if (window.confirm('Are you sure you want to change this user\'s status?')) {
            try {
                await api.put(`/users/${id}/suspend`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to update user status');
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Manage Users</h1>
                    <p className="text-gray-500 font-medium">View and manage all registered customers, riders, and owners.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="rider">Rider</option>
                        <option value="owner">Restaurant Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all mb-6 max-w-md">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b border-gray-100 bg-gray-50/50">
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tl-xl">User</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Role</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Joined Date</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tr-xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-bold">Loading users...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-bold">No users found.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
                                                    {user.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    user.role === 'owner' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                        user.role === 'rider' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                            'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${user.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => handleSuspendUser(user._id)}
                                                disabled={user.email === 'admin@fooddelivery.com'}
                                                className={`font-bold text-sm ${user.status === 'suspended' ? 'text-green-600 hover:text-green-800' : 'text-red-500 hover:text-red-700'} ${user.email === 'admin@fooddelivery.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-extrabold text-gray-900">Add New User</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                    <input type="password" required minLength="6" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                                        <option value="customer">Customer</option>
                                        <option value="rider">Rider</option>
                                        <option value="owner">Restaurant Owner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {formLoading ? 'Saving...' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
