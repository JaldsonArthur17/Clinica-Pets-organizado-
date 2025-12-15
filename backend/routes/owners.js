const express = require("express");
const router = express.Router();
const controller = require("../controllers/ownerController");

// Rotas CRUD
router.get("/", controller.getOwners);          // lista
router.get("/:id", controller.getOwnerById);    // busca por id
router.post("/", controller.createOwner);       // cria
router.put("/:id", controller.updateOwner);     // atualiza
router.delete("/:id", controller.deleteOwner);  // deleta

module.exports = router;
