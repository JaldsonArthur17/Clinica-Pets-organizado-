//conexão com o banco de dados
const db = require("../database");

// Lista pets com o nome do dono
exports.getPets = (req, res) => {
    //comando sql para selecionar todos os pets com o nome do dono
    db.query(`
        SELECT pets.*, owners.name AS owner_name
        FROM pets INNER JOIN owners
        ON pets.owner_id = owners.id
    `, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

// Cria pet com os campos: name, species e owner_id obrigatórios
exports.createPet = (req, res) => {
    const { name, species, breed, birthdate, owner_id } = req.body;
    if (!name || !species || !owner_id)
        return res.status(400).send("Campos obrigatórios: name, species e owner_id");
    //comando pra criar o pet com os campos necessários
    db.query("INSERT INTO pets (name, species, breed, birthdate, owner_id) VALUES (?, ?, ?, ?, ?)",
        [name, species, breed, birthdate, owner_id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Pet criado com sucesso!");
        }
    );
};

// aqui atualizamos o pet
exports.updatePet = (req, res) => {
    const { name, species, breed, birthdate, owner_id } = req.body;
    //comando para editar o pet
    db.query("UPDATE pets SET name=?, species=?, breed=?, birthdate=?, owner_id=? WHERE id=?",
        [name, species, breed, birthdate, owner_id, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Pet atualizado!");
        }
    );
};

// aqui excluímos o pet
exports.deletePet = (req, res) => {
    db.query("DELETE FROM pets WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Pet deletado!");
    });
};
