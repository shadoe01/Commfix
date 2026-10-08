# Commfix Backend (Day 7 foundation)

Node.js + Express backend foundation. Nothing is actually implemented yet —
every route returns a "not implemented" response so you can confirm the
server, routing, CORS, and error handling all work before Day 8 connects a
real database and Day 9+ builds real logic.

## Setup

```bash
cd Backend
npm install
copy .env.example .env
```

Open `.env` and fill in your real MySQL credentials (or leave the defaults
if you haven't set up MySQL yet — the server runs fine without a working
database connection at this stage, since nothing actually queries it yet).

## Run it

```bash
npm run dev
```

You should see:

```
Commfix Backend is running
Server listening on port 4000
Try: http://localhost:4000/api/test
```

(`npm run dev` uses nodemon, which restarts the server automatically when
you edit a file. `npm start` runs it once without that.)

## Test it

Open `http://localhost:4000/api/test` directly in a browser, or use
Postman / Thunder Client (a VS Code extension) to send:

```
GET http://localhost:4000/api/test
```

Expected response (200 OK):

```json
{
  "success": true,
  "message": "COMMFIX API is running",
  "data": {}
}
```

Then test a route that doesn't exist, to confirm error handling works:

```
GET http://localhost:4000/api/does-not-exist
```

Expected response (404):

```json
{
  "success": false,
  "message": "Route not found: GET /api/does-not-exist"
}
```

## Folder structure

```
Backend/
├── server.js            entry point: starts Express, wires everything together
├── .env.example          template for required environment variables
├── config/
│   └── db.js              MySQL connection pool (mysql2, no ORM)
├── routes/
│   ├── index.js            mounts every route group + GET /api/test
│   ├── authRoutes.js        POST /api/auth/register, /login, /logout (stubs)
│   ├── reportRoutes.js      GET/POST /api/reports... (stubs, matches Day 3 plan)
│   ├── residentRoutes.js    GET/PUT /api/residents...
│   ├── facilityRoutes.js    GET/POST/PUT /api/facilities...
│   ├── notificationRoutes.js GET/PUT /api/notifications...
│   └── adminRoutes.js       GET/POST /api/admin/users -- admin-only account
│                            management, NOT a catch-all for every admin
│                            action (see note below)
├── controllers/           one file per route group, each just confirms the
│                          route is reachable for now
├── models/                one placeholder file per Day 3 table, empty until
│                          Day 8 connects the database for real
├── middleware/
│   ├── notFound.js          404 handler
│   ├── errorHandler.js      catches thrown errors, returns clean JSON
│   └── requireRole.js       placeholder role check (real auth is Day 8+)
└── uploads/                where report images will be saved later
```

## Day 8: Database connection + CRUD test

Before any of this, create the database itself: open phpMyAdmin (via
XAMPP), run the SQL in `../Database/schema.sql` (creates `commfix` and all
8 tables). Then fill in `.env` with your real MySQL credentials.

Start the server (`npm run dev`) and check the console:

```
Commfix Backend is running
Server listening on port 4000
Try: http://localhost:4000/api/test
Database connected successfully      <- this line is the Day 8 milestone
```

If you see `Database connection failed: ...` instead, check that MySQL is
actually running in your XAMPP control panel, and that `.env` has the
right `DATABASE_PASSWORD` (XAMPP's default MySQL root password is usually
blank).

### Testing CRUD (temporary routes, Day 8 only)

`routes/dbTestRoutes.js` and `controllers/dbTestController.js` exist only
to prove SELECT/INSERT/UPDATE/DELETE work, using one obviously-fake test
user. Delete both files once you've confirmed this, per Day 8's step 20
("Clean Up Test Data") — Day 9 replaces this with real registration
anyway. Test in this order with Postman or your browser:

1. `GET http://localhost:4000/api/db-test/users` → SELECT. Expect `[]` if
   the table is empty, or a 500 error if the connection/table is wrong —
   fix that before continuing.
2. `POST http://localhost:4000/api/db-test/users` (no body needed) →
   INSERT. Returns the new test user, including its `user_id`. **Copy that
   id**, you'll need it next.
3. `GET http://localhost:4000/api/db-test/users` again → confirm the test
   user now appears.
4. `PUT http://localhost:4000/api/db-test/users/<id>` (use the id from
   step 2) → UPDATE. Confirm the name changed.
5. `DELETE http://localhost:4000/api/db-test/users/<id>` → DELETE. Confirm
   with a final `GET` that the test user is gone.

Once all 4 pass, Day 8 is done — delete `dbTestRoutes.js` and
`dbTestController.js` before starting Day 9.

## Day 9: Real authentication

`POST /api/auth/register` and `POST /api/auth/login` are now real — they
hash passwords with bcryptjs, check for duplicate emails, and return a
signed JWT on successful login. Every other route (`/api/reports`,
`/api/residents`, etc.) now requires that token via `middleware/authenticate.js`;
`/api/admin/users` additionally requires the `admin` role via
`middleware/requireRole.js`.

Before running this, add to your `.env` (copy from `.env.example`, which
already has these two lines):
```
JWT_SECRET=<make up a long random string>
JWT_EXPIRES_IN=7d
```

### Testing with Thunder Client

1. `POST /api/auth/register` with a JSON body:
   ```json
   { "name": "Juan Dela Cruz", "email": "juan@example.com", "password": "password123", "confirmPassword": "password123", "contact": "0917 123 4567", "address": "Minuyan Proper" }
   ```
   Expect `201` and `"message":"Registration successful!"`.
2. Try it again with the same email — expect `409` and `"Email is already registered."`
3. `POST /api/auth/login` with `{ "email": "juan@example.com", "password": "password123" }` — expect a `token` and `user` object back. Copy the token.
4. `GET /api/reports` **without** an Authorization header — expect `401`.
5. `GET /api/reports` **with** header `Authorization: Bearer <token>` — expect the "not implemented yet" stub response (still correct — the *route logic* isn't built until a later day, this just proves the token is accepted).
6. `GET /api/admin/users` with your resident token — expect `403` (wrong role).
7. In phpMyAdmin, check the `users` table: the `password` column should be a long bcrypt hash, not `password123`.

### Creating an admin account

Since there's no public admin registration, use the CLI script instead
(run from the `Backend` folder, with `.env` already filled in and MySQL
running):

```
node scripts/createAdmin.js "Admin Cruz" admin@commfix.local somepassword
```

This hashes the password the same way registration does and inserts the
user directly with `role = 'admin'`. Use that email/password to test
admin login in step 15 of the Day 9 plan.

## Day 11: Real damage reporting

`POST /api/reports`, `GET /api/reports`, and `GET /api/reports/:id` are now
real. Two things had to change in the database for this to work — see
`../Database/migrations/002_add_report_category_and_seed_facilities.sql`
(run it once in phpMyAdmin): it adds the `category` column that was
missing from the Day 3 schema, and seeds the `facilities` table, which was
empty until now.

Security notes baked into `reportController.js`:
- Only accounts with `role = "resident"` can submit a report (403 for admins).
- `resident_id` always comes from the authenticated token
  (`residentModel.findByUserId(req.user.id)`) — never from the request
  body. A resident can't submit a report "as" someone else.
- A resident can only `GET` their own reports; an admin can see all of
  them. Fetching someone else's report by guessing its id returns 403.

Not built yet (per Day 11's own scope): real image upload/storage
(`POST /api/reports/:id/images` is still a 501 stub), and admin status
updates (`PUT /api/reports/:id/status` is still a 501 stub).

## Day 12: Photo upload, storage, viewing, and removal

New package: `multer` — run `npm install` after updating. Database change:
run `../Database/migrations/003_add_image_hash.sql` once in phpMyAdmin
(adds `damage_images.file_hash` and a unique index, used to refuse the same
photo being attached to the same report twice).

Endpoints (all require login):

| Endpoint | What it does |
|---|---|
| `POST /api/reports/:id/images` | Upload one photo (form field name `image`) |
| `GET /api/reports/:id/images/:imageId` | View a photo |
| `DELETE /api/reports/:id/images/:imageId` | Remove a photo |
| `GET /api/reports/:id` | Report details, including its `images` list |
| `GET /api/reports` | List; each report has `thumbnail_image_id` (its first photo, or null) |

Upload checks, in order: a file was attached; report exists (404); caller
owns it or is admin (403); report is still `pending` unless admin (403); fewer
than 5 photos (400); the file's real bytes are JPEG/PNG/WebP, not just
what the browser claimed (400); the same photo isn't already on this report
(409). Any rejection **deletes the file multer already saved** — rejected
uploads never leave orphan files. `middleware/upload.js` also caps size at
5 MB and picks the stored extension from the validated type, never from the
client's filename.

**Photos are not publicly accessible.** There is no static `/uploads` route
any more. Files sit in `uploads/` under random names, and the only way to
read one is `GET /api/reports/:id/images/:imageId`, which checks the login
token and report ownership on every request (a resident gets 403 for
someone else's photo). The frontend fetches photos with its token and shows
them from a temporary local blob (`components/AuthImage.jsx`).

Rules I chose that the plan doesn't dictate: residents can add/remove photos
only while the report is `pending`; max 5 photos per report. Admins are
exempt from the pending rule.

Still a limit worth knowing: the 5 MB size cap and type checks stop casual
misuse, but there's no virus scanning, image re-encoding, or per-user
upload quota — fine for a prototype, not for a public deployment.

Tested without a live server by running `reportController.js` against
in-memory stand-ins for the models with real JPEG/PNG/WebP files (33 checks:
ownership, orphan cleanup, disguised-HTML rejection, duplicates, the 5-photo
cap, the pending rule, cross-report image ids, delete). The real
MySQL/multer/Express wiring still needs a manual run.

## Why `/api/admin` isn't a catch-all

Reports, residents, facilities, and notifications already have their own
routes above, shared between residents and admins — an admin hits the same
`GET /api/reports` a resident does, just with more data returned once a
role check exists. `/api/admin` only holds things that are genuinely
admin-only and don't belong under another resource, which right now is just
account management (the Day 6 "User Management" page).

## Not done yet (by design, per Day 7's scope)

- No real database queries — `config/db.js` can open a connection, but
  nothing calls it yet
- No authentication — `requireRole` always returns "not implemented"
- No input validation
- No image upload handling
- All of the above are intentionally deferred to Day 8+
