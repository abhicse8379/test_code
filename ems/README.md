# College Event Management System

Full-stack implementation of the SRS: student registration, self-service +
admin bulk registration, unique-per-student QR attendance, and manual,
idempotent certificate generation delivered in-app only (no email).

Stack: **React (Vite) + Node/Express + PostgreSQL + Cloudinary (optional fallback)**.

This project is now set up to run locally with a temporary PostgreSQL container
and a built-in fallback for certificate storage, so you can get it working from
first run without needing a live external service.

---

## 1. Prerequisites

- Node.js 18+
- Docker (recommended for local PostgreSQL)
- Optional: a free Cloudinary account if you want remote certificate storage

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

The repository already includes a working local `.env` configuration for the
Postgres container used below.

Start a local PostgreSQL database with Docker:

```bash
docker run --name ems-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ems_db -p 5432:5432 -d postgres:16
```

Create the schema:

```bash
npm run migrate
```

Create your first admin account + default certificate template row:

```bash
node src/db/seedAdmin.js "Local Admin" admin@college.edu admin123
```

Run it:

```bash
npm run dev
```

Backend runs on `http://localhost:4000`. Check `http://localhost:4000/api/health`.

> If you do not configure Cloudinary, the system writes certificate PDFs locally under the backend uploads folder and serves them from the backend.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 4. Using it

1. Go to `/admin/login`, log in with the seeded admin account (`admin@college.edu` / `admin123`).
2. Create an event.
3. As a student, register an account at `/register`, log in, and register for the event.
4. Back as admin, open **Scanner** on the event and scan the student's QR code.
5. Open **Attendance** to confirm the student shows as present.
6. Open **Certificates** and click **Generate Certificates** — it is safe to click more than once because already-issued certificates are skipped.
7. As the student, go to **My Certificates** to download it.

## 5. What's deliberately not built (see SRS §7)

- Password reset flow
- CSV validation beyond "does a `student_id` column exist"
- A certificate template design UI (coordinates are set by hand in the DB)
- Rate limiting on the scan endpoint
- Manual attendance fallback if QR scanning fails at the door — **you flagged
  this as the next thing to close; it isn't in this codebase yet.**

## 6. Project structure

```
backend/
  src/
    db/            schema.sql, pool.js, migrate.js, seedAdmin.js
    middleware/     auth.js (JWT + role guards), upload.js, errorHandler.js
    routes/         auth, events, registrations, attendance, certificates
    utils/          qrToken.js, certificateGenerator.js, cloudinary.js, csvParser.js
    templates/      certificate-template.pdf goes here
    server.js
frontend/
  src/
    api/client.js         axios instance, cookie-based auth
    context/AuthContext.jsx
    components/           Navbar, ProtectedRoute, QRScanner
    pages/                one file per screen, student + admin
    App.jsx                route table
```