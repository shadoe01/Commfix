import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { currentAdmin } from "../../data/placeholder.js";

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminProfile() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your administrator account.</p>
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
          {initials(currentAdmin.name)}
        </div>
        <h2 style={{ margin: 0 }}>{currentAdmin.name}</h2>
        <p style={{ margin: "4px 0 0" }}>{currentAdmin.role}</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="field"><label>Name</label><input defaultValue={currentAdmin.name} /></div>
        <div className="field"><label>Email</label><input defaultValue={currentAdmin.email} /></div>
        <div className="field"><label>Contact</label><input defaultValue={currentAdmin.contact} /></div>
        <Button>Edit Profile</Button>
      </div>

      <div className="card" style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
        <Button variant="secondary">Change Password</Button>
        <Button variant="secondary" onClick={() => navigate("/login")}>Logout</Button>
      </div>
    </>
  );
}
