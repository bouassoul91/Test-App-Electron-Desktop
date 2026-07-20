console.log("Loading preload/index.js");
//const path = require("path");
//const fs = require("fs");
//const leads = require("./leads");
const { contextBridge } = require("electron");
let leads;
let exportApi;

try {
    leads = require("./leads");
} catch (e) {
    console.error("Failed to load preload/leads.js");
    console.error(e);
}

try {
    exportApi = require("./export");
} catch (e) {
    console.error("Failed to load preload/export.js");
    console.error(e);
}

try {
    console.log("PRELOAD START");

    contextBridge.exposeInMainWorld("api", {
        leads,
        export: exportApi,
    });

    console.log("PRELOAD END");
} catch (e) {
    console.error("index.js: preload failed");
    console.error(e);
}