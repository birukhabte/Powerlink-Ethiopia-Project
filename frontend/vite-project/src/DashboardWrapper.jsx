import React from 'react';
import AdminDashboard from './RolePages/Admin/AdminDashboard';
import CustomerDashboard from './RolePages/Customer/CustomerDashboard';
import SupervisorDashboardModern from './RolePages/Supervisor/SupervisorDashboardModern';

const DashboardWrapper = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'admin';

    // Show appropriate dashboard based on role
    if (userRole === 'customer') {
        return <CustomerDashboard />;
    } else if (userRole === 'supervisor') {
        return <SupervisorDashboardModern />;
    }
    
    return <AdminDashboard />;
};

export default DashboardWrapper;
