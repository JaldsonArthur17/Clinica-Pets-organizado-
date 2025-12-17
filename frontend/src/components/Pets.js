import { useEffect, useState } from "react";

function Pets() {
  // --- ESTADOS (Variáveis de Memória) ---
  const [pets, setPets] = useState([]); // Lista de pets para exibir na tabela
  const [owners, setOwners] = useState([]); // Lista de donos para o <select>

  // Variáveis do formulário
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [ownerId, setOwnerId] = useState(""); // ID do dono selecionado

  // Controla se estamos criando (null) ou editando (ID do pet)
  const [editingId, setEditingId] = useState(null);

  // --- EFEITOS (Ao carregar a página) ---

  // 1. Busca os PETS no backend
  useEffect(() => {
    fetch("http://localhost:3000/pets")
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Erro ao buscar pets:", err));
  }, []);

  // 2. Busca os DONOS no backend (essencial para o dropdown funcionar)
  useEffect(() => {
    fetch("http://localhost:3000/owners")
      .then((res) => res.json())
      .then((data) => setOwners(data))
      .catch((err) => console.error("Erro ao buscar donos:", err));
  }, []);

  // --- FUNÇÕES DE AÇÃO ---

  // Salvar ou Atualizar Pet
  function handleSubmit(e) {
    e.preventDefault(); // Impede o recarregamento padrão

    // Validação extra: garante que um dono foi escolhido
    if (!ownerId) {
      alert("Por favor, selecione um dono!");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/pets/${editingId}`
      : "http://localhost:3000/pets";

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
      // Limpa o formulário e recarrega
      setName("");
      setSpecies("");
      setBreed("");
      setBirthdate("");
      setOwnerId("");
      setEditingId(null);
      alert("Pet salvo com sucesso!");
      window.location.reload();
    });
  }

  // Prepara o formulário para editar um pet existente
  function editPet(pet) {
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed || "");
    // Ajusta a data para o formato YYYY-MM-DD que o input aceita
    setBirthdate(pet.birthdate ? pet.birthdate.split("T")[0] : "");
    setOwnerId(pet.owner_id);
    setEditingId(pet.id);
  }

  // Exclui um pet
  function deletePet(id) {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      fetch(`http://localhost:3000/pets/${id}`, {
        method: "DELETE",
      }).then(() => window.location.reload());
    }
  }

  // --- RENDERIZAÇÃO (O que aparece na tela) ---
  return (
    <section>
      <h2>Gerenciar Pets</h2>

      {/* Formulário (O CSS App.css vai organizar em grade) */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome do pet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required // Obrigatório pelo PDF
        />

        <input
          placeholder="Espécie (ex: Cachorro, Gato)"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required // Obrigatório pelo PDF
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
          required // Obrigatório ter dono
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

      {/* --- MELHORIA VISUAL: Tabela em vez de Lista <ul> --- */}
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
              {/* Mostra o nome do dono */}
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
