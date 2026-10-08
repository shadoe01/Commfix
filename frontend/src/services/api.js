// Real backend calls (Day 9), replacing the Day 4 mock versions.
// If VITE_API_BASE_URL isn't set, this falls back to the backend's default
// local address -- fine for development, but you'll want a real .env with
// VITE_API_BASE_URL set once this is deployed anywhere else.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // The backend isn't reachable at all (not running, wrong port, CORS, etc.)
    throw new Error("Can't reach the server. Is the backend running?");
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload.success === false) {
    throw new Error(payload.message || "Something went wrong.");
  }
  return payload.data;
}

export function register({ name, email, password, confirmPassword, contact, address }) {
  return request("/auth/register", {
    method: "POST",
    body: { name, email, password, confirmPassword, contact, address },
  });
}

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

// Everything below is still a stub on the backend (Day 7/8 placeholders) --
// kept here so pages can switch from mock data to real calls later without
// rewriting their imports, per the plan in services/api.js's original
// comment from Day 4.
export function getReports(token) {
  return request("/reports", { token });
}
export function getReport(id, token) {
  return request(`/reports/${id}`, { token });
}
export function submitReport(payload, token) {
  return request("/reports", { method: "POST", body: payload, token });
}
export function updateReportStatus(id, status, token) {
  return request(`/reports/${id}/status`, { method: "PUT", body: { status }, token });
}
export function getResidents(token) {
  return request("/residents", { token });
}
export function getNotifications(token) {
  return request("/notifications", { token });
}

// ---- Day 12: image upload + image URLs ----

// Uploads a photo for an existing report. Uses FormData instead of the
// JSON helper above -- and deliberately does NOT set a Content-Type header:
// the browser has to generate it itself (it includes a unique "boundary"
// string the server needs to split the file from the rest of the form).
// Setting it manually here would break the upload.
export async function uploadReportImage(reportId, file, token) {
  const form = new FormData();
  form.append("image", file); // "image" must match upload.single("image") in the backend

  let res;
  try {
    res = await fetch(`${BASE_URL}/reports/${reportId}/images`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
  } catch (networkErr) {
    throw new Error("Can't reach the server. Is the backend running?");
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload.success === false) {
    throw new Error(payload.message || "Photo upload failed.");
  }
  return payload.data;
}

// Photos are NOT public. <img src="..."> can't send a login token, so the
// photo is fetched here with an Authorization header, turned into a blob,
// and shown from a temporary local URL. Callers should revoke that URL
// (URL.revokeObjectURL) when done -- see components/AuthImage.jsx.
export async function fetchReportImage(reportId, imageId, token) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/reports/${reportId}/images/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (networkErr) {
    throw new Error("Can't reach the server. Is the backend running?");
  }
  if (!res.ok) throw new Error("Photo could not be loaded.");
  return URL.createObjectURL(await res.blob());
}

export function deleteReportImage(reportId, imageId, token) {
  return request(`/reports/${reportId}/images/${imageId}`, { method: "DELETE", token });
}
