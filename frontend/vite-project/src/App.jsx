import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Navbar/Home';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Ticket from './RolePages/Customer/Ticket';
import RequestService from './RolePages/Customer/Request_Service';
import CustDashboard from './RolePages/Customer/CustDashboard';
import CustomerDashboard from './RolePages/Customer/CustomerDashboard';
import ReportOutage from './RolePages/Customer/ReportOutage';
import Notifications from './RolePages/Customer/Notifications';
import History from './RolePages/Customer/History';
import Profile from './RolePages/Customer/Profile';
import DashboardLayout from './Navbar/DashboardLayout';
import AdminLayout from './RolePages/Admin/AdminLayout';
import AdminDashboard from './RolePages/Admin/AdminDashboard';
import ManageAccounts from './RolePages/Admin/ManageAccounts';
import NoticeAndAlerts from './RolePages/Admin/NoticeAndAlerts';
import StaffRegister from './RolePages/Admin/StaffRegister';
import Report from './RolePages/Admin/Report';
import SupervisorDashboard from './RolePages/Supervisor/SupervisorDashboard';
import SupervisorLayout from './RolePages/Supervisor/SupervisorLayout';
import ManageRequest from './RolePages/Supervisor/ManageRequest';
import DocValidation from './RolePages/Supervisor/DocValidation';
import AssignTasks from './RolePages/Supervisor/AssignTasks';
import SupervisorNotifications from './RolePages/Supervisor/SupervisorNotifications';
import SupervisorHistory from './RolePages/Supervisor/SupervisorHistory';
import TaskList from './RolePages/Technician/TaskList';
import TechDashboard from './RolePages/Technician/TechDashboard';
import TechLayout from './RolePages/Technician/TechLayout';
import Chat from './RolePages/Admin/Chat';
import DashboardWrapper from './DashboardWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes - Shows different content based on user role */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/report-outage" element={<ReportOutage />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/request-service" element={<RequestService />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/manage-accounts" element={<ManageAccounts />} />
          <Route path="/admin/notices" element={<NoticeAndAlerts />} />
          <Route path="/admin/register-staff" element={<StaffRegister />} />
          <Route path="/admin/report" element={<Report />} />
          <Route path="/admin/chat" element={<Chat />} />
          <Route path="/supervisor/assign-tasks" element={<AssignTasks />} />
          <Route path="/supervisor/validate" element={<DocValidation />} />
          <Route path="/supervisor/requests" element={<ManageRequest />} />
          <Route path="/supervisor/notifications" element={<SupervisorNotifications />} />
          <Route path="/supervisor/history" element={<SupervisorHistory />} />
          <Route path="/supervisor/chat" element={<Chat />} />
        </Route>



        {/* technician Dashboard Routes with Shared Layout */}
        <Route element={<TechLayout />}>
          <Route path="/technician/tasks" element={<TaskList />} />
          <Route path="/technician-dashboard" element={<TechDashboard />} />
          <Route path="/technician/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
