const express = require("express");
const router = express.Router();
const controller = require("../controllers/petsController");

router.get("/", controller.getPets);
router.post("/", controller.createPet);
router.put("/:id", controller.updatePet);
router.delete("/:id", controller.deletePet);

module.exports = router;
