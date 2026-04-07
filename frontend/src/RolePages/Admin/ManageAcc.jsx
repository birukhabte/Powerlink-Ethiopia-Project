import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    UserMinus,
    Filter,
    Download,
    MoreVertical,
    CheckCircle,
    XCircle,
    Edit,
    Shield,
    Wrench,
    Users,
    Eye
} from 'lucide-react';

const ManageAcc = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Sample user data
    const [users, setUsers] = useState([
        { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', status: 'active', joinDate: '2024-01-15', bpNumber: 'BP-12345' },
        { id: 2, name: 'St. Mary Hospital', email: 'admin@stmary.et', role: 'special', status: 'active', joinDate: '2024-01-10', businessType: 'Hospital' },
        { id: 3, name: 'Tech Michael', email: 'michael@powerlink.et', role: 'technician', status: 'active', joinDate: '2024-01-05', employeeId: 'TECH-023' },
        { id: 4, name: 'Supervisor David', email: 'david@powerlink.et', role: 'supervisor', status: 'active', joinDate: '2024-01-02', employeeId: 'SUP-008' },
        { id: 5, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'customer', status: 'inactive', joinDate: '2023-12-20', bpNumber: 'BP-67890' },
        { id: 6, name: 'Ethio Steel Factory', email: 'factory@ethiosteel.et', role: 'special', status: 'active', joinDate: '2023-12-15', businessType: 'Factory' },
        { id: 7, name: 'Tech Samuel', email: 'samuel@powerlink.et', role: 'technician', status: 'active', joinDate: '2023-12-10', employeeId: 'TECH-024' },
    ]);
}