// Conexão com o MySQL
const mysql = require("mysql2");

// cria a conexão com o banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@1234", // <--- TENTE ASSIM (vazio), é o padrão na maioria dos PCs
  database: "clinica_db", // ATENÇÃO: Verifique se o nome do seu banco é 'clinica_db' ou 'clinica_pets'
});

// conecta ao banco
db.connect((err) => {
  if (err) {
    console.error(
      "ERRO DE CONEXÃO: Verifique se o MySQL está rodando e se a senha está certa.",
      err.code
    );
  } else {
    console.log("MySQL conectado com sucesso!");
  }
});

module.exports = db;
