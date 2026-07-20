console.log("Loading preload/export.js");

const { ipcRenderer } = require("electron");

module.exports = {
    toExcel: (rows, fileName) => ipcRenderer.invoke("export:excel", rows, fileName),
};

console.log("Finished preload/export.js");