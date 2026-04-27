import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Filter, Save, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const ManageAccounts = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [updatingParams, setUpdatingParams] = useState({ id: null, loading: false });

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.users.base, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                setError(response.data.error || 'Failed to load users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingParams({ id: userId, loading: true });
            const token = localStorage.getItem('token');

            await axios.patch(API_ENDPOINTS.users.updateRole(userId), { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Failed to update role');
        } finally {
            setUpdatingParams({ id: null, loading: false });
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const username = (user.username || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = fullName.includes(search) || username.includes(search) || email.includes(search);
        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'supervisor': return 'bg-blue-100 text-blue-700';
            case 'technician': return 'bg-green-100 text-green-700';
            case 'special': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Users className="text-blue-600" size={32} />
                        User Management
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Configure user access levels and system roles.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none w-full sm:w-48 shadow-sm font-medium text-gray-700"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="customer">Customer</option>
                            <option value="special">Special</option>
                            <option value="technician">Technician</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center text-red-700 shadow-sm">
                    <AlertCircle className="mr-3 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Identitiy</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role Assignment</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={40} />
                                        <p className="text-gray-400 font-bold">Retrieving user database...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <Users className="mx-auto text-gray-200 mb-4" size={64} />
                                        <p className="text-gray-400 font-bold">No accounts match your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                                                    {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900">{user.first_name} {user.last_name}</div>
                                                    <div className="text-xs font-bold text-gray-400 tracking-tight">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-700">{user.email}</div>
                                            <div className="text-xs text-gray-400 font-medium">{user.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                                                {user.role || 'customer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    value={user.role}
                                                    disabled={user.role === 'admin' && user.email.includes('admin') /* Safety */}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="special">Special</option>
                                                    <option value="technician">Technician</option>
                                                    <option value="supervisor">Supervisor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                {updatingParams.id === user.id && updatingParams.loading && (
                                                    <Loader2 className="animate-spin text-blue-600" size={16} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing {filteredUsers.length} of {users.length} accounts
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ManageAccounts;
