const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
const crypto = require("crypto");
const { openDb } = require("./db");

let db;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Dev vs prod
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  db = openDb();

  ipcMain.handle("leads:list", () => {
    const rows = db.prepare("SELECT * FROM leads ORDER BY rowid DESC").all();
    return rows.map((r) => ({
      ...r,
      services: r.services ? JSON.parse(r.services) : [],
      notified: !!r.notified,
    }));
  });

  ipcMain.handle("leads:create", (_evt, lead) => {
    const id = lead.id || crypto.randomBytes(4).toString("hex").toUpperCase();
    db.prepare(`
      INSERT INTO leads (id, email, company_name, phone, services, notified)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      lead.email ?? "",
      lead.company_name ?? "",
      lead.phone ?? "",
      JSON.stringify(lead.services ?? []),
      lead.notified ? 1 : 0
    );
    return { ok: true, id };
  });

  ipcMain.handle("leads:update", (_evt, { id, patch }) => {
    // Only allow certain fields
    const allowed = ["email", "company_name", "phone", "services", "notified"];
    const fields = Object.keys(patch).filter((k) => allowed.includes(k));
    if (fields.length === 0) return { ok: false };

    const sets = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => {
      if (f === "services") return JSON.stringify(patch[f] ?? []);
      if (f === "notified") return patch[f] ? 1 : 0;
      return patch[f];
    });

    db.prepare(`UPDATE leads SET ${sets} WHERE id = ?`).run(...values, id);
    return { ok: true };
  });

  ipcMain.handle("leads:delete", (_evt, id) => {
    db.prepare("DELETE FROM leads WHERE id = ?").run(id);
    return { ok: true };
  });

  ipcMain.handle("leads:notifySales", (_evt, id) => {
    // In a real app, you might:
    // - send email/slack via API
    // - create a CRM task
    // For now: mark notified
    db.prepare("UPDATE leads SET notified = 1 WHERE id = ?").run(id);
    return { ok: true };
  });


  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
