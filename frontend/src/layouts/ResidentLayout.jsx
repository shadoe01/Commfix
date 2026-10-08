import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/report-damage", label: "Report Damage" },
  { to: "/my-reports", label: "My Reports" },
  { to: "/residence", label: "Residence" },
  { to: "/profile", label: "Profile" },
  { to: "/notifications", label: "Notifications" },
];

const TITLES = {
  "/": "Dashboard",
  "/report-damage": "Report Damage",
  "/my-reports": "My Reports",
  "/residence": "Residence Information",
  "/profile": "Profile",
  "/notifications": "Notifications",
};

function initials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export default function ResidentLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = pathname.startsWith("/my-reports/") ? "Report Details" : TITLES[pathname] || "Commfix";

  return (
    <div className="app-shell resident-shell">
      <Sidebar items={NAV_ITEMS} tag="Resident" open={open} onNavigate={() => setOpen(false)} />
      <div className="app-main">
        <Topbar
          title={title}
          onMenuClick={() => setOpen((v) => !v)}
          notifTo="/notifications"
          avatarLabel={initials(user?.name)}
        />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
