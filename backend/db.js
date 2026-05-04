const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_romero"
});

db.connect(err => {
    if (err) {
        console.error("Error conexión:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

module.exports = db;