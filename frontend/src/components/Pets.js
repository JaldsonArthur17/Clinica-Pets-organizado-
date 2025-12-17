import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <--- Importamos o useNavigate

function Pets() {
  // --- ESTADOS (Variáveis de Memória) ---
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]); // Lista de donos para o <select>
  const navigate = useNavigate(); // <--- Iniciamos o hook de navegação

  // Variáveis do formulário
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [ownerId, setOwnerId] = useState("");

  // Controla edição
  const [editingId, setEditingId] = useState(null);

  // --- EFEITOS (Ao carregar a página) ---

  // 1. Busca os PETS no backend (Porta 3001)
  useEffect(() => {
    fetch("http://localhost:3001/pets")
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Erro ao buscar pets:", err));
  }, []);

  // 2. Busca os DONOS no backend (Porta 3001)
  useEffect(() => {
    fetch("http://localhost:3001/owners")
      .then((res) => res.json())
      .then((data) => setOwners(data))
      .catch((err) => console.error("Erro ao buscar donos:", err));
  }, []);

  // --- FUNÇÕES DE AÇÃO ---

  function handleSubmit(e) {
    e.preventDefault();

    if (!ownerId) {
      alert("Por favor, selecione um dono!");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    // URL correta na porta 3001
    const url = editingId
      ? `http://localhost:3001/pets/${editingId}`
      : "http://localhost:3001/pets";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        species,
        breed,
        birthdate,
        owner_id: ownerId,
      }),
    }).then(() => {
      // Limpa o formulário
      setName("");
      setSpecies("");
      setBreed("");
      setBirthdate("");
      setOwnerId("");
      setEditingId(null);

      // --- MUDANÇA: Redireciona para a página de sucesso ---
      navigate("/success", {
        state: {
          message: editingId
            ? "Pet atualizado com sucesso!"
            : "Novo pet cadastrado!",
          returnPath: "/pets",
          returnText: "Voltar para Lista de Pets",
        },
      });
    });
  }

  function editPet(pet) {
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed || "");
    setBirthdate(pet.birthdate ? pet.birthdate.split("T")[0] : "");
    setOwnerId(pet.owner_id);
    setEditingId(pet.id);
  }

  function deletePet(id) {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      // URL correta na porta 3001
      fetch(`http://localhost:3001/pets/${id}`, {
        method: "DELETE",
      }).then(() => window.location.reload());
    }
  }

  // --- RENDERIZAÇÃO ---
  return (
    <section>
      <h2>Gerenciar Pets</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome do pet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Espécie (ex: Cachorro, Gato)"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required
        />

        <input
          placeholder="Raça (Opcional)"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <input
          type="date"
          placeholder="Data de Nascimento"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />

        {/* Dropdown de Donos */}
        <select
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          required
        >
          <option value="">Selecione o dono</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingId ? "Atualizar Pet" : "Salvar Pet"}
        </button>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Raça</th>
            <th>Dono</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td>{pet.name}</td>
              <td>{pet.species}</td>
              <td>{pet.breed || "-"}</td>
              <td>{pet.owner_name}</td>
              <td>
                <button className="btn-edit" onClick={() => editPet(pet)}>
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deletePet(pet.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Pets;
