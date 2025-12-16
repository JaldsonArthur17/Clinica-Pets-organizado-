const db = require("../database");

//listagem das consultas (GET)
exports.getAppointments = (req, res) => {
    const sql = "SELECT * FROM appointments";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

//criação de consulta (POST)
exports.createAppointment = (req, res) => {
    const { pet_id, data, veterinarian_name, description, status } = req.boy;
    if (!pet_id || !data || !veterinarian_name) {
        return res.status(400).send("ID, Data e nome do veterinário são necessários.");
    }
    const statusFinal = status || "-- AGENDADA --";

    const sql = "INSERT INTO appointments (pet_id, data, veterinarian_name, description, status) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [pet_id, data, veterinarian_name, description, statusFinal], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Consulta criada com sucesso.");
    });
};

//atualização de consulta (PUT)
exports.updateAppointment = (req, res) => {
    const { pet_id, data, veterinarian_name, description, status } = req.body;
    const id = req.params.id;

    if (!pet_id || !data || !veterinarian_name) {
        return res.status(400).send("ID, Data e nome do veterinário são necessários.");
    }

    const sql = "UPDATE appointments SET pet_id=?, data=?, veterinarian_name=?, description=?, status=? WHERE id=?";

    db.query(sql, [pet_id, data, veterinarian_name, description, status || "-- AGENDADA --", id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Consulta atualizada com sucesso.");
    });
};

//exclusão de consulta (DELETE)
exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    
    db.query("DELE FROM appointments WHERE id=?", [id], (err, result) => {
        if (err) res.status(500).send(err);
        res.send("Consulta excluída com sucesso.");
    });
};