const db = require("../database");

function cleanDate(dateString) {
  if (!dateString) return null;
  return dateString.replace("T", " ").replace("Z", "").split(".")[0];
}

// Listagem das consultas (GET)
exports.getAppointments = (req, res) => {
  // Adicionei ORDER BY para mostrar as consultas na ordem correta
  const sql = "SELECT * FROM appointments ORDER BY date ASC";
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

  const dateFinal = cleanDate(date);
  const statusFinal = status || "AGENDADA";

  const sql =
    "INSERT INTO appointments (pet_id, date, veterinarian_name, description, status) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [pet_id, dateFinal, veterinarian_name, description, statusFinal],
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
  
  const dateFinal = cleanDate(date);

  const sql =
    "UPDATE appointments SET pet_id=?, date=?, veterinarian_name=?, description=?, status=? WHERE id=?";

  db.query(
    sql,
    [
      pet_id,
      dateFinal,
      veterinarian_name,
      description,
      status || "AGENDADA",
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Consulta atualizada com sucesso.");
    }
  );
};

// Exclusão de consulta (DELETE)
exports.deleteAppointment = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM appointments WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Consulta excluída com sucesso.");
  });
};
