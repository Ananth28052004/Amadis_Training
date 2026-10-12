const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Ananth@24",
    database: "Student"
});

module.exports = db;