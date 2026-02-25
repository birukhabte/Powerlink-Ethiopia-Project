import React from 'react';
import { Outlet } from 'react-router-dom';
import SupervisorSidebar from '../../Navbar/SupervisorSidebar';

const SupervisorLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <SupervisorSidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SupervisorLayout;
