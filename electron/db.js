const LeadsTable = require("./tables/LeadsTable");

DatabaseManager.createTable(LeadsTable);
DatabaseManager.getAll(LeadsTable);
DatabaseManager.insert(LeadsTable, lead);
DatabaseManager.update(LeadsTable,id,data);
DatabaseManager.delete(LeadsTable,id);