import React from 'react';
import { Outlet } from 'react-router-dom';
import TechnicianSidebar from '../../Navbar/TechnicianSidebar';

const TechLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <TechnicianSidebar />
            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default TechLayout;
