import { useEffect, useState } from "react";

function Pets() {
  const [pets, setPets] = useState([]); //aqui é onde a gente 'acessa' a lista dos pets
  const [owners, setOwners] = useState([]); //aqui a gente acessa a lista dos donos
//essas são as variáveis que são 'linkadas' no formulário
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [ownerId, setOwnerId] = useState("");

  // Controla se estamos criando (null) ou editando (ID do pet)
  const [editingId, setEditingId] = useState(null);

  // esse bloco busca os pets quando a tela carrega
  useEffect(() => {
    fetch("http://localhost:3000/pets")
      .then(res => res.json())
      .then(data => setPets(data));
  }, []);

  // já esse bloco busca os donos quando a tela carrega
  useEffect(() => {
    fetch("http://localhost:3000/owners")
      .then(res => res.json())
      .then(data => setOwners(data));
  }, []);

  //aqui é feita a função que salva ou atuliza os pets
  function handleSubmit(e) {
    e.preventDefault();
// Decide se é POST (criar) ou PUT (editar)
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/pets/${editingId}`
      : "http://localhost:3000/pets";
    
// Envia os dados, incluindo o ID do dono escolhido
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        species,
        owner_id: ownerId
      })
    }).then(() => {
      // Limpa tudo e recarrega a página
      setName("");
      setSpecies("");
      setOwnerId("");
      setEditingId(null);
      window.location.reload();
    });
  }

//esse bloco preenche o formulário com os dados do pet para edição
  function editPet(pet) {
    setName(pet.name);
    setSpecies(pet.species);
    setOwnerId(pet.owner_id);
    setEditingId(pet.id);
  }

//função que deleta o pet
  function deletePet(id) {
    fetch(`http://localhost:3000/pets/${id}`, {
      method: "DELETE"
    }).then(() => window.location.reload());
  }


  //aqui retorna o html --> o que o usuário vai ver
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
