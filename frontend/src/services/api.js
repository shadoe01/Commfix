// Placeholder API layer for Day 4.
//
// Every function here currently resolves with mock data from
// src/data/placeholder.js instead of calling the backend. Once the
// Express API from the Day 3 plan exists, replace each body with a
// real fetch() call, e.g.:
//
//   export async function login(email, password) {
//     const res = await fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) throw new Error("Login failed");
//     return res.json();
//   }

import { reports, residents, notifications } from "../data/placeholder.js";

const delay = (value, ms = 200) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function login(email, password) {
  return delay({ token: "mock-token", email });
}

export function register(payload) {
  return delay({ id: "U-999", ...payload });
}

export function getReports() {
  return delay(reports);
}

export function getReport(id) {
  return delay(reports.find((r) => r.id === id));
}

export function submitReport(payload) {
  return delay({ id: "0999", status: "pending", ...payload });
}

export function updateReportStatus(id, status) {
  return delay({ id, status });
}

export function getResidents() {
  return delay(residents);
}

export function getNotifications() {
  return delay(notifications);
}
