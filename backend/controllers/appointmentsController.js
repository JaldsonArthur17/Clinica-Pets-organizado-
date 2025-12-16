const db = require("../database");

// Listagem das consultas (GET)
exports.getAppointments = (req, res) => {
  const sql = "SELECT * FROM appointments";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};

// Criação de consulta (POST)
exports.createAppointment = (req, res) => {
  const { pet_id, date, veterinarian_name, description, status } = req.body;

  if (!pet_id || !date || !veterinarian_name) {
    return res
      .status(400)
      .send("ID, Data e nome do veterinário são necessários.");
  }

  // Ajuste: O banco geralmente espera 'AGENDADA' simples, sem os traços, mas mantive sua lógica se o ENUM permitir.
  const statusFinal = status || "AGENDADA";

  const sql =
    "INSERT INTO appointments (pet_id, date, veterinarian_name, description, status) VALUES (?, ?, ?, ?, ?)";

  // CORREÇÃO: mudado de (err, res) para (err, result)
  db.query(
    sql,
    [pet_id, date, veterinarian_name, description, statusFinal],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Consulta criada com sucesso.");
    }
  );
};

// Atualização de consulta (PUT)
exports.updateAppointment = (req, res) => {
  const { pet_id, date, veterinarian_name, description, status } = req.body;
  const id = req.params.id;

  if (!pet_id || !date || !veterinarian_name) {
    return res
      .status(400)
      .send("ID, Data e nome do veterinário são necessários.");
  }

  const sql =
    "UPDATE appointments SET pet_id=?, date=?, veterinarian_name=?, description=?, status=? WHERE id=?";

  db.query(
    sql,
    [pet_id, date, veterinarian_name, description, status || "AGENDADA", id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Consulta atualizada com sucesso.");
    }
  );
};

// Exclusão de consulta (DELETE)
exports.deleteAppointment = (req, res) => {
  const { id } = req.params;

  // CORREÇÃO: mudado de (err, res) para (err, result)
  db.query("DELETE FROM appointments WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).send(err); // aqui faltava o return também
    res.send("Consulta excluída com sucesso.");
  });
};
