//importação do framework express
const express = require("express");

//criação do 'roteador' do express
const router = express.Router();

//importação do controller appointments
const controller = require("../controllers/appointmentsController");

router.get("/", controller.getAppointments);         // lista todas as consultas 
router.post("/", controller.createAppointment);      // cria nova consulta
router.put("/:id", controller.updateAppointment);   // atualiza consulta (status, data, etc) 
router.delete("/:id", controller.deleteAppointment); // deleta

//aqui o módulo entrega o roteador pra uso
module.exports = router;
