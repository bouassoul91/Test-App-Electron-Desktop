const ExcelJS = require("exceljs");
const { dialog, BrowserWindow } = require("electron");

class ExcelExportService {

    static async exportRows(rows, options = {}) {

        if (!rows || rows.length === 0) {
            throw new Error("No rows to export");
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(options.sheetName || "Export");

        const keys = Object.keys(rows[0]);
        sheet.columns = keys.map((key) => ({ header: key, key, width: 22 }));

        rows.forEach((row) => {
            const flatRow = { ...row };
            if (Array.isArray(flatRow.services)) {
                flatRow.services = flatRow.services.join(", ");
            }
            sheet.addRow(flatRow);
        });

        sheet.getRow(1).font = { bold: true };

        const win = BrowserWindow.getFocusedWindow();
        const { canceled, filePath } = await dialog.showSaveDialog(win, {
            title: "Export selected leads",
            defaultPath: options.defaultFileName || "leads-export.xlsx",
            filters: [{ name: "Excel Workbook", extensions: ["xlsx"] }],
        });

        if (canceled || !filePath) {
            return { canceled: true };
        }

        await workbook.xlsx.writeFile(filePath);

        return { canceled: false, filePath };

    }

}

module.exports = ExcelExportService;