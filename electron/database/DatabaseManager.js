const db = require("./db");

class DatabaseManager {

    static initialize(tables) {
        tables.forEach(table => this.createTable(table));
    }

    static createTable(table){

        const columns = Object.entries(table.columns)
            .map(([name,type]) => `${name} ${type}`)
            .join(", ");

        db.prepare(`
            CREATE TABLE IF NOT EXISTS ${table.name}
            (${columns})
        `).run();

    }

    static getAll(table){

        return db.prepare(`
            SELECT *
            FROM ${table.name}
        `).all();

    }

    static insert(table,data){
        const columns = Object.keys(data);

        const placeholders =
            columns.map(() => "?").join(",");

        const sql = `
            INSERT INTO ${table.name}
            (${columns.join(",")})
            VALUES (${placeholders})
        `;

        db.prepare(sql)
        .run(...columns.map(c => data[c]));

    }

    static select(table, options = {}) {

        let sql = `SELECT * FROM ${table.name}`;

        if (options.where)
            sql += ` WHERE ${options.where}`;

        if (options.orderBy)
            sql += ` ORDER BY ${options.orderBy}`;

        if (options.limit)
            sql += ` LIMIT ${options.limit}`;

        return db.prepare(sql).all();
    }

    static hydrate(row) {
        return {
            ...row,
            services: row.services ? JSON.parse(row.services) : [],
            notified: Boolean(row.notified)
        };
    }

}
module.exports = DatabaseManager;