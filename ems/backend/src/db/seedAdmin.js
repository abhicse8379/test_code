// Creates the first admin account and a default certificate_templates row.
// Usage: node src/db/seedAdmin.js "Admin Name" admin@college.edu somePassword
require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./pool");

async function seed() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.error('Usage: node src/db/seedAdmin.js "Admin Name" admin@college.edu somePassword');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO admins (name, email, password_hash) VALUES ($1,$2,$3)
     ON CONFLICT (email) DO NOTHING`,
    [name, email, password_hash]
  );

  // Default template row — points at src/templates/certificate-template.pdf.
  // You must place that file yourself (see backend/src/templates/README.txt).
  await pool.query(
    `INSERT INTO certificate_templates (name, file_path, name_x, name_y, event_x, event_y, date_x, date_y, font_size)
     SELECT 'Default Template', 'certificate-template.pdf', 300, 320, 300, 260, 300, 200, 22
     WHERE NOT EXISTS (SELECT 1 FROM certificate_templates WHERE name = 'Default Template')`
  );

  console.log("Seed complete: admin account and default template row created (if not already present).");
  await pool.end();
}

seed();
