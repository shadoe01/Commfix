import { Link } from "react-router-dom";

/**
 * Top bar shared by resident and admin layouts.
 * `roleSwitch` renders the temporary Resident/Admin view toggle described
 * in the README -- delete it once real login + roles are wired up.
 */
export default function Topbar({ title, onMenuClick, notifTo, avatarLabel, roleSwitch }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        {roleSwitch}
        <Link to={notifTo} className="topbar-bell" aria-label="Notifications">
          🔔
          <span className="dot" />
        </Link>
        <div className="topbar-avatar">{avatarLabel}</div>
      </div>
    </header>
  );
}
