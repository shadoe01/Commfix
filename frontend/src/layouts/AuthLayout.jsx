import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="mark">C</span>
          <span>Commfix</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
