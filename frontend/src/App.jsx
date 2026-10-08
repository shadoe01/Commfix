import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import ResidentLayout from "./layouts/ResidentLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import ResidentDashboard from "./pages/resident/Dashboard.jsx";
import Profile from "./pages/resident/Profile.jsx";
import Residence from "./pages/resident/Residence.jsx";
import ReportDamage from "./pages/resident/ReportDamage.jsx";
import MyReports from "./pages/resident/MyReports.jsx";
import ReportDetails from "./pages/resident/ReportDetails.jsx";
import ResidentNotifications from "./pages/resident/Notifications.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import DamageReports from "./pages/admin/DamageReports.jsx";
import AdminReportDetails from "./pages/admin/ReportDetails.jsx";
import AIAssessment from "./pages/admin/AIAssessment.jsx";
import ResidentRecords from "./pages/admin/ResidentRecords.jsx";
import ResidentDetails from "./pages/admin/ResidentDetails.jsx";
import FacilityManagement from "./pages/admin/FacilityManagement.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import AdminNotifications from "./pages/admin/Notifications.jsx";
import AdminProfile from "./pages/admin/Profile.jsx";

export default function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Resident -- requires login, and specifically the "resident" role */}
      <Route element={<ProtectedRoute role="resident" />}>
        <Route element={<ResidentLayout />}>
          <Route path="/" element={<ResidentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/residence" element={<Residence />} />
          <Route path="/report-damage" element={<ReportDamage />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/my-reports/:id" element={<ReportDetails />} />
          <Route path="/notifications" element={<ResidentNotifications />} />
        </Route>
      </Route>

      {/* Admin -- requires login, and specifically the "admin" role */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<DamageReports />} />
          <Route path="/admin/reports/:id" element={<AdminReportDetails />} />
          <Route path="/admin/reports/:id/ai" element={<AIAssessment />} />
          <Route path="/admin/residents" element={<ResidentRecords />} />
          <Route path="/admin/residents/:id" element={<ResidentDetails />} />
          <Route path="/admin/facilities" element={<FacilityManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
