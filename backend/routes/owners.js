//importação do framework express
const express = require("express");
//criação do 'roteador' do express
const router = express.Router();
//importação do controller dos donos
const controller = require("../controllers/ownerController");

// Rotas com os métodos do controller pra manipulação
router.get("/", controller.getOwners);          // lista
router.get("/:id", controller.getOwnerById);    // busca por id
router.post("/", controller.createOwner);       // cria
router.put("/:id", controller.updateOwner);     // atualiza
router.delete("/:id", controller.deleteOwner);  // deleta

//aqui o módulo entrega o roteador pra uso
module.exports = router;
