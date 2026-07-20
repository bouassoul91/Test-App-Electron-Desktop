module.exports = {
    name: "leads",

    columns: {
        id: "TEXT PRIMARY KEY",
        email: "TEXT",
        company_name: "TEXT",
        phone: "TEXT",
        services: "TEXT",
        notified: "INTEGER"
    },

    editable: [
        "email",
        "company_name",
        "phone",
        "services",
        "notified"
    ]
};