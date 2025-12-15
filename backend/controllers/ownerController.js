//conexão com o banco de dados
const db = require("../database");

// Lista todos os donos
exports.getOwners = (req, res) => {
    //comando sql pra selecionar todos os donos
    db.query("SELECT * FROM owners", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

// Buscar um dono pelo ID
exports.getOwnerById = (req, res) => {
    //comando sql pra selecionar o dono pelo id
    db.query("SELECT * FROM owners WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result[0]);
    });
};

// Cria dono com name e telefone sendo obrigatórios
exports.createOwner = (req, res) => {
    const { name, phone, address } = req.body;
    if (!name || !phone) return res.status(400).send("Nome e telefone são obrigatórios!");
    //comando pra criar o dono com os campos necessários
    db.query("INSERT INTO owners (name, phone, address) VALUES (?, ?, ?)",
        [name, phone, address],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Dono criado com sucesso!");
        }
    );
};

// aqui editar o dono
exports.updateOwner = (req, res) => {
    const { name, phone, address } = req.body;
    //comando pra editar o dono
    db.query("UPDATE owners SET name=?, phone=?, address=? WHERE id=?", 
        [name, phone, address, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Dono atualizado!");
        }
    );
};

// aqui deletamos o dono
exports.deleteOwner = (req, res) => {
    db.query("DELETE FROM owners WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Dono deletado!");
    });
};
