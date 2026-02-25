import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    // These states might need to be context-based if they are used deep in subpages,
    // but for now we'll pass them down or keep them for the dashboard only.
    const [showOutageForm, setShowOutageForm] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Provide a context or simplified way to trigger these from sub-pages if if needed
    // For now, let's keep it simple.

    return (
        <div className="min-h-screen bg-gray-50">


            <div className="flex">
                <Sidebar
                    setShowOutageForm={setShowOutageForm}
                    setShowMap={setShowMap}
                    showOutageForm={showOutageForm}
                    showMap={showMap}
                />
                <main className="flex-1 p-6">
                    {/* Pass the state to the Outlet if we are on the dashboard */}
                    <Outlet context={{ showOutageForm, setShowOutageForm, showMap, setShowMap }} />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
