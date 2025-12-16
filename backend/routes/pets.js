//importação do framework express
const express = require("express");

//criação do 'roteador' do express
const router = express.Router();

//importação do controller dos pets
const controller = require("../controllers/petsController");

//Rotas com os métodos do controller pra manipulação
router.get("/", controller.getPets);     // lista
router.get("/:id", controller.getPetById); // busca por ID
router.post("/", controller.createPet);  // cria
router.put("/:id", controller.updatePet);  // atualiza
router.delete("/:id", controller.deletePet); // deleta

//aqui o módulo entrega o roteador pra uso
module.exports = router;
