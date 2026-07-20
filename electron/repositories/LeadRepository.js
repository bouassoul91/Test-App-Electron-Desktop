const DatabaseManager = require("../database/DatabaseManager");
const LeadsTable = require("../database/tables/LeadsTable");

class LeadRepository {

    static getAll() {

        const rows = DatabaseManager.select(
            LeadsTable,
            {
                orderBy: "rowid DESC"
            }
        );

        return rows.map((row) => ({
            ...row,
            services: row.services
                ? JSON.parse(row.services)
                : [],
            notified: Boolean(row.notified)
        }));

    }

}

module.exports = LeadRepository;