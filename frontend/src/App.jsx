import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Navbar/Home';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Ticket from './RolePages/Customer/Ticket';
import RequestService from './RolePages/Customer/Request_Service';
import CustDashboard from './RolePages/Customer/CustDashboard';
import DashboardLayout from './Navbar/DashboardLayout';
import AdminDashboard from './RolePages/Admin/AdminDashboard';
import ManageAccounts from './RolePages/Admin/ManageAccounts';
import NoticeAndAlerts from './RolePages/Admin/NoticeAndAlerts';
import StaffRegister from './RolePages/Admin/StaffRegister';
import Report from './RolePages/Admin/Report';
import SupervisorDashboard from './RolePages/Supervisor/SupervisorDashboard';
import SupervisorLayout from './RolePages/Supervisor/SupervisorLayout';
import ManageRequest from './RolePages/Supervisor/ManageRequest';
import DocValidation from './RolePages/Supervisor/DocValidation';
import TaskList from './RolePages/Technician/TaskList';
import TechDashboard from './RolePages/Technician/TechDashboard';
import TechLayout from './RolePages/Technician/TechLayout';
import ServiceMap from './RolePages/Technician/ServiceMap';
import Schedule from './RolePages/Technician/Schedule';
import TechChat from './RolePages/Technician/Chat';
import Updates from './RolePages/Technician/Updates';
import Chat from './RolePages/Admin/Chat';
import SharedProfile from './RolePages/Shared/Profile';
import SharedHistory from './RolePages/Shared/History';
import SharedNotifications from './RolePages/Shared/Notifications';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* customer Dashboard Routes with Shared Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<CustDashboard />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/request-service" element={<RequestService />} />
          <Route path="/customer/profile" element={<SharedProfile />} />
          <Route path="/customer/history" element={<SharedHistory />} />
          <Route path="/customer/notifications" element={<SharedNotifications />} />
        </Route>

        {/* admin Dashboard Routes with Shared Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin/report" element={<Report />} />
          <Route path="/admin/register-staff" element={<StaffRegister />} />
          <Route path="/admin/notices" element={<NoticeAndAlerts />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-accounts" element={<ManageAccounts />} />
          <Route path="/admin/chat" element={<Chat />} />
          <Route path="/admin/profile" element={<SharedProfile />} />
          <Route path="/admin/history" element={<SharedHistory />} />
          <Route path="/admin/notifications" element={<SharedNotifications />} />
        </Route>
        {/* supervisor Dashboard Routes with Shared Layout */}
        <Route element={<SupervisorLayout />}>
          <Route path="/supervisor/validate" element={<DocValidation />} />
          <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
          <Route path="/supervisor/requests" element={<ManageRequest />} />
          <Route path="/supervisor/chat" element={<Chat />} />
          <Route path="/supervisor/profile" element={<SharedProfile />} />
          <Route path="/supervisor/history" element={<SharedHistory />} />
          <Route path="/supervisor/notifications" element={<SharedNotifications />} />
        </Route>
        {/* technician Dashboard Routes with Shared Layout */}
        <Route element={<TechLayout />}>
          <Route path="/technician/tasks" element={<TaskList />} />
          <Route path="/technician-dashboard" element={<TechDashboard />} />
          <Route path="/technician/map" element={<ServiceMap />} />
          <Route path="/technician/schedule" element={<Schedule />} />
          <Route path="/technician/chat" element={<TechChat />} />
          <Route path="/technician/updates" element={<Updates />} />
          <Route path="/technician/profile" element={<SharedProfile />} />
          <Route path="/technician/history" element={<SharedHistory />} />
          <Route path="/technician/notifications" element={<SharedNotifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
