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

## Day 9: Real authentication

Login and Register now call the real backend instead of faking success.
Copy `.env.example` to `.env` in this folder and point it at your running
backend (defaults to `http://localhost:4000/api`, which matches the
backend's default port).

What changed:
- `src/context/AuthContext.jsx` — holds the logged-in user + token,
  persisted to `localStorage` so refreshing the page doesn't log you out.
  See the comment there about the XSS tradeoff of localStorage vs. an
  httpOnly cookie.
- `src/components/ProtectedRoute.jsx` — wraps the resident and admin route
  groups in `App.jsx`. Not logged in → bounced to `/login`. Logged in as
  the wrong role (e.g. a resident hitting `/admin`) → bounced to `/`.
- **The Day 6 Resident/Administrator login toggle is gone.** Role now
  comes from the account itself (whatever's in the database), not a tab
  you click — keeping the toggle would have let anyone claim to be an
  admin.
- **The temporary RoleSwitch top-bar toggle is gone too**, same reason —
  both layouts now show your real initials instead.
- Login/Register show a real "Logging in..." / "Creating account..."
  disabled-button state while the request is in flight, and show whatever
  error message the backend actually sends back (e.g. "Email is already
  registered.") instead of the old fake client-only checks.
- Logout (in both Profile pages) now actually clears the stored token and
  redirects to `/login` — try accessing `/` or `/admin` afterward to
  confirm `ProtectedRoute` kicks you back out.

Registration only creates **resident** accounts, on purpose — see the
backend README for how to create an admin account to test with.

Report Damage, My Reports, Notifications, and the rest of the admin pages
still use the mock data in `src/data/placeholder.js` — wiring those to the
real (still-stub) backend routes is later work, not Day 9.

## Day 11: Real damage reporting

The Report Damage wizard now actually saves to the database. Run the
database migration in the backend's README first, or this will fail with
"Unknown facility" errors.

What changed:
- `ReviewStep.jsx`'s Submit Report button calls the real
  `POST /api/reports` (via `services/api.js`'s `submitReport`), using your
  logged-in token. On success it moves to the success screen with the
  real report id from the database; on failure it shows the backend's
  actual error message instead of always succeeding.
- The fake "AI Analyzing..." step and its mock result are still there as a
  prototype preview — **but that mock AI result is not sent to the
  backend or saved anywhere.** Day 11 deliberately doesn't implement real
  AI yet (that's a later phase), so Report Details now says "Not yet
  analyzed" rather than showing the fake result as if it were real.
- `MyReports.jsx`, the resident `Dashboard.jsx`, and `ReportDetails.jsx`
  all now fetch real reports from the backend instead of
  `data/placeholder.js` — loading and error states included. A resident
  only ever sees their own reports; that's enforced on the backend, not
  just hidden in the UI.
- Image upload is still just a local preview (`URL.createObjectURL`) —
  nothing is actually uploaded to the server. That's explicitly Day 12+
  work per the plan.

The admin-side Damage Reports page still uses mock data — wiring that up
is separate work, not part of Day 11's resident-focused scope.

## Day 12: Photos

- **Wizard** (`PhotoStep.jsx`, `ReviewStep.jsx`): the chosen `File` is kept
  (not just a preview URL). Submit is two-stage: create the report, then
  upload the photo against its new id. If the report saves but the photo
  doesn't, you still get the success screen with a warning — retrying the
  whole submit would create a duplicate report — and can use **Add a photo**
  on the report afterwards.
- **Report Details** (`pages/resident/ReportDetails.jsx`): shows every photo,
  "No photos attached." when none, **Remove photo N** buttons, and an **Add a
  photo** input. Both controls disappear once the report is no longer
  pending or has 5 photos (the backend enforces this too).
- **My Reports**: each card shows report #, category, facility + location,
  date, status, severity, and a thumbnail (the report's first photo).
- **Photos are private.** `<img src>` can't send a login token, so
  `components/AuthImage.jsx` fetches each photo through
  `services/api.js → fetchReportImage()` with the token and displays a
  temporary blob URL, freed on unmount.
- `utils/imageRules.js` holds the type/size/count limits in one place.
  Client checks are for speed; the backend re-checks everything.

Photo is **required** in the wizard (there is no skip), which fits the later
AI step that needs an image. The API itself allows reports without photos.

Checked with a TypeScript syntax pass over all 49 source files plus
import/export resolution — that proves the files parse and link, not that
they behave correctly in a browser. Please click through it.

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
