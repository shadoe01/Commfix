import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/my-reports", label: "Reports", icon: "📋" },
  { to: "/report-damage", label: "Report", icon: "➕", primary: true },
  { to: "/notifications", label: "Alerts", icon: "🔔" },
  { to: "/profile", label: "Me", icon: "👤" },
];

/**
 * Mobile-only bottom tab bar for the resident app. Same destinations as the
 * desktop sidebar -- only the layout changes between screen sizes.
 */
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}${item.primary ? " primary" : ""}`}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
