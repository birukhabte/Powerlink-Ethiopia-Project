import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Filter, Save, X, Check, AlertCircle } from 'lucide-react';
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
            const response = await axios.get(API_ENDPOINTS.users.base);
            
            // Handle the API response format: { success: true, users: [...] }
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                setError(response.data.error || 'Failed to load users');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please ensure backend is running.');
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingParams({ id: userId, loading: true });

            await axios.patch(API_ENDPOINTS.users.updateRole(userId), { role: newRole });

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));

            setUpdatingParams({ id: null, loading: false });
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Failed to update role');
            setUpdatingParams({ id: null, loading: false });
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'supervisor': return 'bg-blue-100 text-blue-800';
            case 'technician': return 'bg-orange-100 text-orange-800';
            case 'special': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800'; // customer
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center text-gray-800">
                        <Users className="mr-3 text-blue-600" /> User Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage user accounts and assign roles</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full sm:w-48"
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
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center mb-6 text-red-700">
                    <AlertCircle className="mr-2" /> {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                                <th className="p-4 font-semibold">User Info</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Current Role</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                                            <div className="text-sm text-gray-500">@{user.username}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(user.role)}`}>
                                                {user.role || 'customer'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                                                value={user.role}
                                                disabled={user.role === 'admin' && user.email === 'admin@powerlink.et' /* Prevent changing main admin */}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="special">Special</option>
                                                <option value="technician">Technician</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {updatingParams.id === user.id && updatingParams.loading && (
                                                <span className="ml-2 text-xs text-blue-600">Saving...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
                    <span>Showing {filteredUsers.length} users</span>
                    <span>Total: {users.length}</span>
                </div>
            </div>
        </div>
    );
};

export default ManageAccounts;
