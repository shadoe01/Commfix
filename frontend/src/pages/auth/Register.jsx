import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { users } from "../../data/placeholder.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { name: "", email: "", contact: "", address: "", password: "", confirm: "" };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email address.";
    else if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) e.email = "An account with this email already exists.";
    if (!form.contact.trim()) e.contact = "Contact number is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match.";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) navigate("/");
  }

  return (
    <>
      <h2>Create your account</h2>
      <p>Sign up to report infrastructure problems in your community.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className={`field${errors.name ? " has-error" : ""}`}>
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" placeholder="Juan Dela Cruz" value={form.name} onChange={(e) => update("name", e.target.value)} />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div className={`field${errors.email ? " has-error" : ""}`}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className={`field${errors.contact ? " has-error" : ""}`}>
          <label htmlFor="contact">Contact number</label>
          <input id="contact" type="tel" placeholder="09xx xxx xxxx" value={form.contact} onChange={(e) => update("contact", e.target.value)} />
          {errors.contact && <div className="field-error">{errors.contact}</div>}
        </div>
        <div className={`field${errors.address ? " has-error" : ""}`}>
          <label htmlFor="address">Address</label>
          <input id="address" type="text" placeholder="Purok, street" value={form.address} onChange={(e) => update("address", e.target.value)} />
          {errors.address && <div className="field-error">{errors.address}</div>}
        </div>
        <div className={`field${errors.password ? " has-error" : ""}`}>
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>
        <div className={`field${errors.confirm ? " has-error" : ""}`}>
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} />
          {errors.confirm && <div className="field-error">{errors.confirm}</div>}
        </div>
        <Button type="submit" block>Create account</Button>
      </form>
      <p className="auth-foot">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  );
}
