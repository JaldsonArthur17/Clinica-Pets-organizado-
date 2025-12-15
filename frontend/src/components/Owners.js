import { useEffect, useState } from "react";

function Owners() {
  const [owners, setOwners] = useState([]);

  // Campos do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Controla se estamos editando
  const [editingId, setEditingId] = useState(null);

  // Busca donos
  useEffect(() => {
    fetch("http://localhost:3000/owners")
      .then(res => res.json())
      .then(data => setOwners(data));
  }, []);

  // Envia (criar ou editar)
  function handleSubmit(e) {
    e.preventDefault();

    // Se estiver editando, usa PUT
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/owners/${editingId}`
      : "http://localhost:3000/owners";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address })
    }).then(() => {
      // Limpa formulário
      setName("");
      setPhone("");
      setAddress("");
      setEditingId(null);
      window.location.reload();
    });
  }

  // Preenche formulário para edição
  function editOwner(owner) {
    setName(owner.name);
    setPhone(owner.phone);
    setAddress(owner.address);
    setEditingId(owner.id);
  }

  // Deleta dono
  function deleteOwner(id) {
    fetch(`http://localhost:3001/owners/${id}`, {
      method: "DELETE"
    }).then(() => window.location.reload());
  }

  return (
    <section>
      <h2>Donos</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Telefone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          placeholder="Endereço"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <button>
          {editingId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul>
        {owners.map(owner => (
          <li key={owner.id}>
            {owner.name} - {owner.phone}
            <button onClick={() => editOwner(owner)}>Editar</button>
            <button onClick={() => deleteOwner(owner.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Owners;
