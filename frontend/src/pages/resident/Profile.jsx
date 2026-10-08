import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function initials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your account information.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480, textAlign: "center" }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--color-primary)", color: "var(--color-text-inverse)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "var(--text-xl)", fontWeight: 700, margin: "0 auto 12px",
          }}
        >
          {initials(user?.name)}
        </div>
        <h2 style={{ margin: 0 }}>{user?.name}</h2>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="field">
          <label>Full name</label>
          <input defaultValue={user?.name} />
        </div>
        <div className="field">
          <label>Email</label>
          <input defaultValue={user?.email} />
        </div>
        <div className="field">
          <label>Contact number</label>
          <input placeholder="Not loaded yet -- GET /api/residents/:id is still a Day 7/8 stub" />
        </div>
        <div className="field">
          <label>Address</label>
          <input placeholder="Not loaded yet -- GET /api/residents/:id is still a Day 7/8 stub" />
        </div>
        <Button>Save changes</Button>
      </div>

      <div className="card" style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
        <Button variant="secondary">Change Password</Button>
        <Button variant="secondary" onClick={() => { logout(); navigate("/login"); }}>Logout</Button>
      </div>
    </>
  );
}
