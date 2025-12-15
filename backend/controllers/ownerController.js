const db = require("../database");

// Lista todos os donos
exports.getOwners = (req, res) => {
    db.query("SELECT * FROM owners", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

// Busca 1 dono pelo ID
exports.getOwnerById = (req, res) => {
    db.query("SELECT * FROM owners WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result[0]);
    });
};

// Cria dono (name e phone são obrigatórios)
exports.createOwner = (req, res) => {
    const { name, phone, address } = req.body;
    if (!name || !phone) return res.status(400).send("Nome e telefone são obrigatórios!");

    db.query("INSERT INTO owners (name, phone, address) VALUES (?, ?, ?)",
        [name, phone, address],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Dono criado com sucesso!");
        }
    );
};

// Edita dono
exports.updateOwner = (req, res) => {
    const { name, phone, address } = req.body;

    db.query("UPDATE owners SET name=?, phone=?, address=? WHERE id=?", 
        [name, phone, address, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Dono atualizado!");
        }
    );
};

// Deleta dono
exports.deleteOwner = (req, res) => {
    db.query("DELETE FROM owners WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Dono deletado!");
    });
};
