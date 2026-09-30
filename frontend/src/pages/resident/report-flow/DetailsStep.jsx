import { useState } from "react";
import Button from "../../../components/Button.jsx";
import { facilities, damageCategories } from "../../../data/placeholder.js";

function computeErrors(form) {
  const e = {};
  if (!form.facility) e.facility = "Select the affected facility.";
  if (!form.category) e.category = "Select a damage category.";
  if (!form.location || form.location.trim().length < 3) e.location = "Enter a location.";
  if (!form.description || form.description.trim().length < 10) e.description = "Describe the damage (at least 10 characters).";
  return e;
}

export default function DetailsStep({ data, onNext }) {
  const [form, setForm] = useState(data);
  const [touched, setTouched] = useState(false);

  const errors = touched ? computeErrors(form) : {};
  const isValid = Object.keys(computeErrors(form)).length === 0;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (isValid) onNext(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`field${errors.facility ? " has-error" : ""}`}>
        <label htmlFor="facility">Facility</label>
        <select id="facility" value={form.facility} onChange={(e) => update("facility", e.target.value)}>
          <option value="">Select facility</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.name}>{f.name}</option>
          ))}
        </select>
        {errors.facility && <div className="field-error">{errors.facility}</div>}
      </div>

      <div className={`field${errors.category ? " has-error" : ""}`}>
        <label htmlFor="category">Damage category</label>
        <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">Select category</option>
          {damageCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <div className="field-error">{errors.category}</div>}
      </div>

      <div className={`field${errors.location ? " has-error" : ""}`}>
        <label htmlFor="location">Location</label>
        <input id="location" type="text" placeholder="e.g. near the basketball court" value={form.location} onChange={(e) => update("location", e.target.value)} />
        {errors.location && <div className="field-error">{errors.location}</div>}
      </div>

      <div className={`field${errors.description ? " has-error" : ""}`}>
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={4} placeholder="Describe what you saw" value={form.description} onChange={(e) => update("description", e.target.value)} />
        {errors.description && <div className="field-error">{errors.description}</div>}
      </div>

      <Button type="submit" block disabled={!isValid}>Continue</Button>
    </form>
  );
}
