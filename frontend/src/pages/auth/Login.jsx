import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function validate() {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setFormError("");
    if (Object.keys(e).length > 0) return;

    // Placeholder credential check for the prototype: any password under 6
    // characters is treated as "incorrect" so the error state is reachable.
    // Real authentication replaces this entirely once the backend exists.
    if (password.length < 6) {
      setFormError("Invalid email or password.");
      return;
    }
    navigate(role === "admin" ? "/admin" : "/");
  }

  return (
    <>
      <div className="topbar-role-switch" style={{ marginBottom: 20, width: "100%" }}>
        <button
          type="button"
          className={role === "resident" ? "active" : ""}
          style={{ flex: 1, border: "none", background: "none", padding: "8px 0", cursor: "pointer" }}
          onClick={() => setRole("resident")}
        >
          Resident
        </button>
        <button
          type="button"
          className={role === "admin" ? "active" : ""}
          style={{ flex: 1, border: "none", background: "none", padding: "8px 0", cursor: "pointer" }}
          onClick={() => setRole("admin")}
        >
          Administrator
        </button>
      </div>
      <h2>{role === "admin" ? "Admin Login" : "Welcome back"}</h2>
      <p>
        {role === "admin"
          ? "Log in with your administrator account to manage reports and residents."
          : "Log in to report or track community infrastructure issues."}
      </p>
      {formError && <div className="form-banner-error">{formError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className={`field${errors.email ? " has-error" : ""}`}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className={`field${errors.password ? " has-error" : ""}`}>
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>
        <Button type="submit" block>Log in</Button>
      </form>
      <p className="auth-foot">
        {role === "admin" ? (
          "Forgot password? Contact your system administrator."
        ) : (
          <>Forgot password? · New here? <Link to="/register">Create an account</Link></>
        )}
      </p>
    </>
  );
}
