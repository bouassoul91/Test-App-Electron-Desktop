const path = require("path");
const Database = require("better-sqlite3");
const { app } = require("electron");

function openDb() {
  const dbPath = path.join(app.getPath("userData"), "leads.db");
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      company_name TEXT NOT NULL,
      phone TEXT,
      services TEXT,          -- JSON string array e.g. ["SEO","Press"]
      notified INTEGER DEFAULT 0
    );
  `);

  // Seed sample data if empty
  const count = db.prepare("SELECT COUNT(*) AS c FROM leads").get().c;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO leads (id, email, company_name, phone, services, notified)
      VALUES (@id, @email, @company_name, @phone, @services, @notified)
    `);

    const sample = [
      {
        id: "5298PQ52",
        email: "emily.johnson@bluepeaksolutions.com",
        company_name: "BluePeak Solutions",
        phone: "1 555-0100",
        services: JSON.stringify(["SEO"]),
        notified: 0,
      },
      {
        id: "5298PQ53",
        email: "liam.patel@quantumdynamics.com",
        company_name: "Quantum Dynamics",
        phone: "44 20 7946 0958",
        services: JSON.stringify(["Press"]),
        notified: 0,
      },
      {
        id: "EXXY2DE7",
        email: "carlos.garcia@echostreamtech.com",
        company_name: "EchoStream Technologies",
        phone: "1 555-0101",
        services: JSON.stringify(["SEO", "Content"]),
        notified: 0,
      },
    ];

    const tx = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
    tx(sample);
  }

  return db;
}

module.exports = { openDb };
