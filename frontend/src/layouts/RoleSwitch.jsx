import { NavLink } from "react-router-dom";

// Temporary helper so both roles are reachable without real auth yet.
// Remove this once login actually determines the user's role.
export default function RoleSwitch() {
  return (
    <div className="topbar-role-switch">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        Resident view
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
        Admin view
      </NavLink>
    </div>
  );
}
