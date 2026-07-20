const { ipcMain } = require("electron");

const LeadRepository = require("../repositories/LeadRepository");

module.exports = function registerLeadIPC() {

    ipcMain.handle("leads:list", () => {console.log("IPC CALLED"); return LeadRepository.getAll();});

    ipcMain.handle("leads:create", (_, lead) => {return LeadRepository.create(lead);});

    ipcMain.handle("leads:update", (_, args) => {return LeadRepository.update(args.id, args.patch);});

    ipcMain.handle("leads:delete", (_, id) => {return LeadRepository.delete(id);});

    ipcMain.handle("leads:notifySales", (_, id) => {return LeadRepository.notifySales(id);});

};