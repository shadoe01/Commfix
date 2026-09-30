import { NavLink } from "react-router-dom";

// Mirrors the resident BottomNav for mobile. Facility and User management
// stay desktop-sidebar-only for now -- they're lower-frequency back-office
// tasks, not something an admin typically manages from a phone in the field.
const ITEMS = [
  { to: "/admin", label: "Home", icon: "🏠", end: true },
  { to: "/admin/reports", label: "Reports", icon: "📋" },
  { to: "/admin/residents", label: "Residents", icon: "👥" },
  { to: "/admin/notifications", label: "Alerts", icon: "🔔" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

export default function AdminBottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
