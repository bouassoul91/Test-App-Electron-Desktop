const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  listLeads: () => ipcRenderer.invoke("leads:list"),
  updateLead: (id, patch) => ipcRenderer.invoke("leads:update", { id, patch }),
  createLead: (lead) => ipcRenderer.invoke("leads:create", lead),
  deleteLead: (id) => ipcRenderer.invoke("leads:delete", id),
  notifySales: (id) => ipcRenderer.invoke("leads:notifySales", id),
});