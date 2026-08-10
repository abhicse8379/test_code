-- College Event Management System — schema
-- Run with: psql "$DATABASE_URL" -f src/db/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE IF NOT EXISTS students (
  student_id      VARCHAR(50) PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  email           VARCHAR(150) NOT NULL,
  department      VARCHAR(100),
  year            INT,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  admin_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(150) NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(30) NOT NULL DEFAULT 'admin',
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificate_templates (
  template_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(150) NOT NULL,
  file_path       VARCHAR(255) NOT NULL, -- path under backend/src/templates
  name_x          INT NOT NULL DEFAULT 300,
  name_y          INT NOT NULL DEFAULT 300,
  event_x         INT NOT NULL DEFAULT 300,
  event_y         INT NOT NULL DEFAULT 250,
  date_x          INT NOT NULL DEFAULT 300,
  date_y          INT NOT NULL DEFAULT 200,
  font_size       INT NOT NULL DEFAULT 24
);

CREATE TABLE IF NOT EXISTS events (
  event_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                    VARCHAR(200) NOT NULL,
  description              TEXT,
  event_date               TIMESTAMP NOT NULL,
  venue                    VARCHAR(200),
  registration_deadline    TIMESTAMP,
  certificate_template_id  UUID REFERENCES certificate_templates(template_id),
  created_by_admin_id      UUID REFERENCES admins(admin_id),
  status                   VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft','published','completed','cancelled')),
  created_at               TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registrations (
  registration_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        VARCHAR(50) NOT NULL REFERENCES students(student_id),
  event_id          UUID NOT NULL REFERENCES events(event_id),
  registered_via    VARCHAR(20) NOT NULL CHECK (registered_via IN ('self','bulk_upload')),
  qr_code_token     VARCHAR(64) UNIQUE NOT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (student_id, event_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  registration_id     UUID PRIMARY KEY REFERENCES registrations(registration_id),
  status              VARCHAR(10) NOT NULL DEFAULT 'absent' CHECK (status IN ('absent','present')),
  scanned_at           TIMESTAMP,
  scanned_by_admin_id  UUID REFERENCES admins(admin_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  certificate_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id    UUID UNIQUE NOT NULL REFERENCES registrations(registration_id),
  certificate_url    VARCHAR(500),
  generated_at       TIMESTAMP
);

-- Track each student's last login so we can compute "new since last login" certificate badges
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON registrations(student_id);
