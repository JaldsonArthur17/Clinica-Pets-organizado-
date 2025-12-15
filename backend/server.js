// Importa dependências
const express = require("express");
const cors = require("cors");

// Importa rotas
const ownersRoutes = require("./routes/owners");
const petsRoutes = require("./routes/pets");

const app = express();

// Faz API entender JSON enviado pelo front
app.use(express.json());
app.use(cors());

// Registra as rotas
app.use("/owners", ownersRoutes);
app.use("/pets", petsRoutes);

// Inicia o servidor
app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
