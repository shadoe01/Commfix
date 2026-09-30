// Mock data for the Day 4 frontend skeleton.
// Replace with real API responses once src/services/api.js talks to the backend.

export const currentAdmin = {
  name: "Admin Cruz",
  email: "admin@commfix.local",
  contact: "0918 222 3344",
  role: "Barangay Administrator",
};

export const currentResident = {
  name: "Juan Dela Cruz",
  email: "juan.delacruz@example.com",
  contact: "0917 123 4567",
  address: "Minuyan Proper",
  household: "Dela Cruz Household",
};

export const damageCategories = [
  "Road Damage",
  "Drainage Damage",
  "Streetlight Outage",
  "Structural Damage",
  "Flooding",
  "Other",
];

export const facilities = [
  { id: "F-001", name: "Minuyan Proper Road", type: "Road", location: "Minuyan Proper", status: "active" },
  { id: "F-002", name: "Barangay Covered Court", type: "Public Facility", location: "Barangay Hall Complex", status: "active" },
  { id: "F-003", name: "Main Drainage Line", type: "Drainage", location: "Purok 3", status: "under_repair" },
  { id: "F-004", name: "Purok 5 Streetlight", type: "Streetlight", location: "Purok 5", status: "active" },
];

export const reports = [
  {
    id: "0001",
    facility: "Minuyan Proper Road",
    category: "Road Damage",
    description: "Large pothole near the barangay hall, about a meter wide.",
    location: "Minuyan Proper",
    status: "under_review",
    severity: "moderate",
    date: "Sep 21, 2026",
    resident: "Juan Dela Cruz",
    ai: { type: "Pothole / Road Damage", severity: "moderate", confidence: 87 },
  },
  {
    id: "0002",
    facility: "Main Drainage Line",
    category: "Drainage Damage",
    description: "Drainage overflow causing flooding after rain.",
    location: "Purok 3",
    status: "in_progress",
    severity: "severe",
    date: "Sep 18, 2026",
    resident: "Maria Santos",
    ai: { type: "Drainage Damage", severity: "severe", confidence: 91 },
  },
  {
    id: "0003",
    facility: "Purok 5 Streetlight",
    category: "Streetlight Outage",
    description: "Streetlight has been out for a week.",
    location: "Purok 5",
    status: "resolved",
    severity: "low",
    date: "Sep 10, 2026",
    resident: "Juan Dela Cruz",
    ai: { type: "Streetlight Outage", severity: "low", confidence: 78 },
  },
  {
    id: "0004",
    facility: "Barangay Covered Court",
    category: "Structural Damage",
    description: "Cracked wall near the entrance.",
    location: "Barangay Hall Complex",
    status: "pending",
    severity: "low",
    date: "Sep 27, 2026",
    resident: "Pedro Reyes",
    ai: { type: "Structural Damage", severity: "low", confidence: 65 },
  },
];

export const residents = [
  { id: "R-001", name: "Juan Dela Cruz", household: "Dela Cruz Household", contact: "0917 123 4567", reports: 2, status: "active" },
  { id: "R-002", name: "Maria Santos", household: "Santos Household", contact: "0917 555 2211", reports: 1, status: "active" },
  { id: "R-003", name: "Pedro Reyes", household: "Reyes Household", contact: "0917 888 9090", reports: 1, status: "active" },
];

export const notifications = [
  { id: 1, message: "Your report #0001 is now Under Review.", date: "Sep 22, 2026", read: false },
  { id: 2, message: "Your report #0003 has been Resolved.", date: "Sep 15, 2026", read: true },
  { id: 3, message: "New damage report submitted for Barangay Covered Court.", date: "Sep 27, 2026", read: false },
];

export const users = [
  { id: "U-001", name: "Juan Dela Cruz", email: "juan.delacruz@example.com", role: "resident" },
  { id: "U-002", name: "Maria Santos", email: "maria.santos@example.com", role: "resident" },
  { id: "U-003", name: "Admin Cruz", email: "admin@commfix.local", role: "admin" },
];

export function findReport(id) {
  return reports.find((r) => r.id === id);
}

export function findResident(id) {
  return residents.find((r) => r.id === id);
}
