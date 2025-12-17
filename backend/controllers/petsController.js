//conexão com o banco de dados
const db = require("../database");

// Lista pets com o nome do dono (GET)
exports.getPets = (req, res) => {
  //comando sql para selecionar todos os pets com o nome do dono
  db.query(
    `
        SELECT pets.*, owners.name AS owner_name
        FROM pets INNER JOIN owners
        ON pets.owner_id = owners.id
    `,
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    }
  );
};

// Cria pet com os campos: name, species e owner_id obrigatórios (POST)
exports.createPet = (req, res) => {
  const { name, species, breed, birthdate, owner_id } = req.body;

  if (!name || !species || !owner_id) {
    return res
      .status(400)
      .send("Campos obrigatórios: name, species e owner_id");
  }
  // Validação: Verifica se o dono existe antes de criar
  db.query("SELECT id FROM owners WHERE id = ?", [owner_id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(400).send("Dono não encontrado (owner_id inválido)");
    }

    db.query(
      "INSERT INTO pets (name, species, breed, birthdate, owner_id) VALUES (?, ?, ?, ?, ?)",
      [name, species, breed, birthdate, owner_id],
      (insertErr) => {
        if (insertErr) return res.status(500).send(insertErr);
        res.send("Pet criado com sucesso!");
      }
    );
  });
};

// aqui atualizamos o pet (UPDATE)
exports.updatePet = (req, res) => {
  const { name, species, breed, birthdate, owner_id } = req.body;
  //comando para editar o pet
  db.query(
    "UPDATE pets SET name=?, species=?, breed=?, birthdate=?, owner_id=? WHERE id=?",
    [name, species, breed, birthdate, owner_id, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Pet atualizado!");
    }
  );
};

// --- AQUI ESTÁ A MUDANÇA (DELETE) ---
// Apaga as consultas do pet ANTES de apagar o pet
exports.deletePet = (req, res) => {
  const id = req.params.id;

  // 1. Deleta todas as consultas vinculadas a este pet
  db.query("DELETE FROM appointments WHERE pet_id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);

    // 2. Agora que está "limpo", deleta o pet
    db.query("DELETE FROM pets WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).send(err);
      res.send("Pet e suas consultas foram deletados!");
    });
  });
};

// Busca um pet pelo ID
exports.getPetById = (req, res) => {
  db.query(
    "SELECT * FROM pets WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).send("Pet não encontrado");
      res.send(result[0]);
    }
  );
};
