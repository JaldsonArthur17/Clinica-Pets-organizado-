import { useEffect, useState } from "react";

function Pets() {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [ownerId, setOwnerId] = useState("");

  // Controla edição
  const [editingId, setEditingId] = useState(null);

  // Busca pets
  useEffect(() => {
    fetch("http://localhost:3000/pets")
      .then(res => res.json())
      .then(data => setPets(data));
  }, []);

  // Busca donos
  useEffect(() => {
    fetch("http://localhost:3001/owners")
      .then(res => res.json())
      .then(data => setOwners(data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

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
        owner_id: ownerId
      })
    }).then(() => {
      setName("");
      setSpecies("");
      setOwnerId("");
      setEditingId(null);
      window.location.reload();
    });
  }

  function editPet(pet) {
    setName(pet.name);
    setSpecies(pet.species);
    setOwnerId(pet.owner_id);
    setEditingId(pet.id);
  }

  function deletePet(id) {
    fetch(`http://localhost:3000/pets/${id}`, {
      method: "DELETE"
    }).then(() => window.location.reload());
  }

  return (
    <section>
      <h2>Pets</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome do pet"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Espécie"
          value={species}
          onChange={e => setSpecies(e.target.value)}
        />

        <select
          value={ownerId}
          onChange={e => setOwnerId(e.target.value)}
          required
        >
          <option value="">Selecione o dono</option>
          {owners.map(owner => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>

        <button>
          {editingId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul>
        {pets.map(pet => (
          <li key={pet.id}>
            {pet.name} ({pet.species}) - Dono: {pet.owner_name}
            <button onClick={() => editPet(pet)}>Editar</button>
            <button onClick={() => deletePet(pet.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Pets;
