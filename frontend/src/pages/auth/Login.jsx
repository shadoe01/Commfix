import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setFormError("");
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      // The backend decides the role -- it's whatever is actually stored
      // on the account, not a tab the person clicked (that's the Day 6
      // RoleSwitch/toggle this replaces; a real login can't let someone
      // just declare themselves an admin).
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setFormError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h2>Welcome back</h2>
      <p>Log in to report or track community infrastructure issues.</p>
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
        <Button type="submit" block disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <p className="auth-foot">
        Forgot password? · New here? <Link to="/register">Create an account</Link>
      </p>
    </>
  );
}
