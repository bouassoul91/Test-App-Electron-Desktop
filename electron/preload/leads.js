console.log("Loading preload/leads.js");

const { ipcRenderer } = require("electron");

console.log("ipcRenderer =", ipcRenderer);

module.exports = {
    listLeads: () => ipcRenderer.invoke("leads:list"),
    createLead: (lead) => ipcRenderer.invoke("leads:create", lead),
    updateLead: (id, patch) => ipcRenderer.invoke("leads:update", { id, patch }),
    deleteLead: (id) => ipcRenderer.invoke("leads:delete", id),
    notifySales: (id) => ipcRenderer.invoke("leads:notifySales", id),
};

console.log("Finished preload/leads.js");