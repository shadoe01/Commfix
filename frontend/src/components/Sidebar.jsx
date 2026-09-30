import { NavLink } from "react-router-dom";

/**
 * Reusable sidebar. `items` is [{ to, label }], `tag` is the small
 * label above the nav (e.g. "Resident" or "Administrator").
 */
export default function Sidebar({ items, tag, open, onNavigate }) {
  return (
    <aside className={`sidebar${open ? " open" : ""}`}>
      <div className="sidebar-brand">
        <span className="mark">C</span>
        Commfix
      </div>
      <div className="sidebar-tag">{tag}</div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon-dot" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
