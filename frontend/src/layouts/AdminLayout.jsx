import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import AdminBottomNav from "../components/AdminBottomNav.jsx";
import RoleSwitch from "./RoleSwitch.jsx";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/reports", label: "Damage Reports" },
  { to: "/admin/residents", label: "Resident Records" },
  { to: "/admin/facilities", label: "Facilities" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/notifications", label: "Notifications" },
  { to: "/admin/profile", label: "Profile" },
];

const TITLES = {
  "/admin": "Admin Dashboard",
  "/admin/reports": "Damage Reports",
  "/admin/residents": "Resident Records",
  "/admin/facilities": "Facility Management",
  "/admin/users": "User Management",
  "/admin/notifications": "Notifications",
  "/admin/profile": "Profile",
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  let title = TITLES[pathname];
  if (!title) {
    if (pathname.includes("/ai")) title = "AI Assessment";
    else if (pathname.startsWith("/admin/reports/")) title = "Report Details";
    else if (pathname.startsWith("/admin/residents/")) title = "Resident Details";
    else title = "Commfix Admin";
  }

  return (
    <div className="app-shell admin-shell">
      <Sidebar items={NAV_ITEMS} tag="Administrator" open={open} onNavigate={() => setOpen(false)} />
      <div className="app-main">
        <Topbar
          title={title}
          onMenuClick={() => setOpen((v) => !v)}
          notifTo="/admin/notifications"
          avatarLabel="AC"
          roleSwitch={<RoleSwitch />}
        />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}
