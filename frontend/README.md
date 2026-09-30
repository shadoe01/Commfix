# Commfix Frontend (Day 4 skeleton)

React + Vite frontend skeleton for Commfix. This is the interface shell from Day 4:
every page and layout exists and is navigable, but nothing talks to a real
backend yet. All data on the pages comes from `src/data/placeholder.js`.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## What's here

```
src/
├── main.jsx            entry point
├── App.jsx             all routes
├── styles/
│   ├── tokens.css       design tokens (colors, type, spacing)
│   └── global.css       base styles + shared component classes
├── layouts/
│   ├── AuthLayout.jsx    centered card layout for login/register
│   ├── ResidentLayout.jsx  sidebar + topbar shell for resident pages
│   └── AdminLayout.jsx     sidebar + topbar shell for admin pages
├── components/           reusable UI: Sidebar, Topbar, StatCard, badges, Button, EmptyState
├── pages/
│   ├── auth/             Login, Register
│   ├── resident/         Dashboard, Profile, Residence, Report Damage, My Reports, Report Details, Notifications
│   └── admin/            Dashboard, Damage Reports, Report Details, AI Assessment, Resident Records,
│                         Resident Details, Facility Management, User Management, Notifications
├── data/placeholder.js   mock reports, facilities, residents, notifications used across pages
├── services/api.js       placeholder fetch wrapper — swap the mock calls for real fetch() once the backend exists
└── assets/               static images/icons (empty for now — see assets/README.md)
```

## Responsive breakpoints

- **Desktop** (> 1024px): full sidebar, full spacing.
- **Tablet** (≤ 1024px): sidebar narrows, content padding tightens, the Resident/Admin
  view switch shrinks.
- **Mobile** (≤ 860px): sidebar becomes an off-canvas drawer opened by the ☰ button in
  the top bar.

Resize the browser window (or use dev tools device mode) to check all three.

## Routes

Resident: `/login`, `/register`, `/`, `/profile`, `/residence`, `/report-damage`,
`/my-reports`, `/my-reports/:id`, `/notifications`

Admin: `/admin`, `/admin/reports`, `/admin/reports/:id`, `/admin/reports/:id/ai`,
`/admin/residents`, `/admin/residents/:id`, `/admin/facilities`, `/admin/users`,
`/admin/notifications`

There's a small role switcher in the top bar of each layout (Resident view / Admin view)
so you can click between the two without two separate logins — remove it once real
authentication exists.

## Wiring it to a real backend later

Replace the functions in `src/services/api.js` with real `fetch()` calls to the
endpoints planned in the Day 3 document (`/api/reports`, `/api/register`, etc.),
and swap `src/data/placeholder.js` imports in each page for the results of those calls.

## Day 5: Resident UI/UX

The resident side now behaves like an app prototype, not just a form:

- **Mobile navigation** is a bottom tab bar (Home, Reports, Report, Alerts, Me)
  instead of the hamburger/sidebar drawer. Desktop still uses the sidebar —
  same destinations, different layout per screen size. Admin is unchanged
  (still sidebar-only on all sizes, since it's a back-office console).
- **Report Damage** (`src/pages/resident/report-flow/`) is now a multi-step
  flow: fill in details → add/preview a photo → a short "Analyzing..." step
  → a mock AI result → a final review screen → a success screen with a
  report number. Each step is a separate component; `ReportDamage.jsx`
  orchestrates which one is showing.
- **Login and Register** have real client-side validation: empty fields,
  invalid email format, a password-mismatch check on Register, a duplicate
  email check against `data/placeholder.js`, and a show/hide password
  toggle. Login treats any password under 6 characters as "incorrect" so the
  error banner is reachable in the prototype — replace this block entirely
  once real authentication exists (see the comment in `Login.jsx`).
- **Report Details** shows a ✓ / current / ○ status stepper
  (`components/StatusStepper.jsx`) instead of just a status word.
- **My Reports** and **Notifications** (resident side) are stacked cards
  instead of tables, so nothing needs horizontal scrolling on a phone.
- **Profile** has an avatar initial circle and Change Password / Logout
  buttons (both placeholders — Logout just routes to /login).

New shared pieces: `components/BottomNav.jsx`, `components/StatusStepper.jsx`,
`components/LoadingState.jsx`, plus CSS for cards, the stepper, the wizard's
progress dots, and form error states, all added to
`styles/global.css` / `styles/layout.css`.

## Day 6: Admin UI/UX

The admin side now matches the same "rough but complete, mock data only"
treatment the resident side got on Day 5:

- **Admin gets a mobile bottom nav too** (Home, Reports, Residents, Alerts,
  Profile) via `components/AdminBottomNav.jsx` — desktop keeps the sidebar.
  Facility and User management are intentionally sidebar/desktop-only; they
  didn't make the 5-item mobile nav in the plan, and it's a reasonable call
  for infrequent back-office tasks.
- **Login has a Resident / Administrator toggle** at the top, so there's an
  actual "Admin Login" heading and flow, rather than relying only on the
  temporary RoleSwitch in the top bar. Admin mode hides the "Create an
  account" link, since admin accounts should be provisioned, not
  self-registered (an open item from the Day 2 doc).
- **Damage Reports** has a real search box plus status and category filters
  (both actually filter the list), and a date-range dropdown that's UI-only
  for now — it needs real timestamps from a backend to mean anything.
- **Report Details** has quick-action buttons (Mark Under Review, Mark
  Resolved, Reject-with-required-remark) for the common transitions, with
  the full 6-status dropdown tucked under "Advanced" for anything else. See
  the note in `ReportDetails.jsx` about why both exist.
- **Resident Details** adds a status badge, reports-submitted count, and
  Edit / View Reports buttons.
- **Admin Profile** (`/admin/profile`) is new — a personal profile page for
  the logged-in admin, separate from User Management (which manages *other*
  accounts).
- **Notifications** now has Mark All as Read.
- **Dashboard** adds reports-by-category and reports-by-severity
  breakdowns.
- **Loading / empty / error states** are now visible on Damage Reports and
  Resident Records (a brief simulated load on page open). Damage Reports
  also has a "Simulate error" button — that's a Day 6 prototype device to
  demonstrate the error state on demand, not real error-handling logic;
  remove it once real API calls exist.

## Installable app (PWA)

Commfix is set up so it can be "installed" from the browser to a home screen
or desktop, instead of being viewed only as a website:

- `public/manifest.webmanifest` — app name, icons, colors, and standalone
  display mode
- `public/icons/` — the app icon at the sizes Android/iOS/desktop expect
- `public/sw.js` — a small service worker that caches the app shell so a
  repeat visit (or a flaky connection) still shows something
- registered in `src/main.jsx`, **production builds only** (see the comment
  there for why)

To actually test installing it:

```bash
npm run build
npm run preview
```

Open the printed URL. In Chrome/Edge you'll see an install icon in the
address bar; on Android Chrome, a "Add to Home screen" prompt; on iOS Safari,
use Share → Add to Home Screen (iOS doesn't support the install prompt, but
the manifest + icons still make it behave like an app once added).

This is app-shell caching, not full offline data sync — once the backend
exists, API requests (`/api/...`) are deliberately excluded from the cache in
`sw.js` so residents always see live report data when they have a
connection.

## Not done yet (by design, per the Day 4 plan)

- No real authentication, validation, or API calls
- No image upload handling beyond a file input placeholder
- No responsive testing beyond the built-in breakpoint (this still needs a pass on real devices)
