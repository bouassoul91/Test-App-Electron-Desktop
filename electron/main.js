const { app, BrowserWindow } = require("electron");
const path = require("path");

const DatabaseManager = require("./database/DatabaseManager");
const Tables = require("./database/TableRegistry");

const registerLeadIPC = require("./ipc/leads");
const registerExportIPC = require("./ipc/export"); 

function createWindow() {
    console.log("******** PRELOAD LOADED ********");
    const win = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload", "index.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools({ mode: "detach" });
    } else {
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }
}

app.whenReady().then(() => {

    DatabaseManager.initialize(Tables);

    registerLeadIPC();
    registerExportIPC(); 

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });

});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});