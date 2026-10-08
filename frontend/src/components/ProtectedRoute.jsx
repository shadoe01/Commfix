import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Wraps a group of routes. Sends to /login if not authenticated.
 * Pass `role` to also require a specific role (e.g. "admin") -- a
 * logged-in resident hitting an admin-only route gets redirected to
 * their own home instead of seeing the admin screens.
 */
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null; // still checking localStorage on first load

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Send a role mismatch to THAT role's own home, not always "/" -- sending
  // an admin to "/" would land them right back inside this same
  // resident-only group, checking the same mismatch again: an infinite
  // redirect loop. Each role goes to its own territory instead.
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/"} replace />;
  }

  return <Outlet />;
}
