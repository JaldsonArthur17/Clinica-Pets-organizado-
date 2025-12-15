// Conexão com o MySQL
const mysql = require("mysql2");

// cria a conexão com o banco
const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // seu usuário MySQL
    password: "@1234",       // sua senha
    database: "clinica_db"
});

// conecta ao banco
db.connect((err) => {
    if (err) throw err;
    console.log("MySQL conectado!");
});

module.exports = db;
