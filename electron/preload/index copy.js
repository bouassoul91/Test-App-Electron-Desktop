console.log("******** PRELOAD LOADED INDEX.JS ********");
const { contextBridge } = require("electron");
const path = require("path");
//const fs = require("fs");

try {
    //console.log("__dirname =", __dirname);
    console.error("Failed to load preload/leads.js");
    //console.log("Exists =", fs.existsSync(path.join(__dirname, "leads.js")));
    //console.log("Files =", fs.readdirSync(__dirname));
    //const leads = require("./leads");
} catch (e) {
    console.error("Failed to load preload/leads.js");
    //console.error(e);
}

console.log("PRELOAD START");

console.log("contextBridge =", contextBridge);
console.log("ipcRenderer =", typeof ipcRenderer);

//contextBridge.exposeInMainWorld("api", {leads});
contextBridge.exposeInMainWorld("api", {test: () => "Hello",});

console.log("PRELOAD END");

