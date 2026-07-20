const { ipcMain } = require("electron");

const ExcelExportService = require("../services/ExcelExportService");

module.exports = function registerExportIPC() {

    ipcMain.handle("export:excel", async (_, rows, fileName) => {
        return ExcelExportService.exportRows(rows, { defaultFileName: fileName });
    });

};