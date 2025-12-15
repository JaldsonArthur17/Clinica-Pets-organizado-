import { useEffect, useState } from "react";

//aqui a gente cria o componente de donos ---> 
// variáveis pra guardar os dados
function Owners() {
  const [owners, setOwners] = useState([]);

  // Campos do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Controla se estamos editando
  const [editingId, setEditingId] = useState(null);

  // aqui o bloco busca os donos quando a tela é iniciada
  useEffect(() => {
    fetch("http://localhost:3000/owners")
      .then(res => res.json())
      .then(data => setOwners(data));
  }, []);

  // esse bloco envia as alterações do formulário
  function handleSubmit(e) {
    e.preventDefault();

    // Se estiver editando, usa PUT, senão ele usa POST pra criar
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

  // Preenche formulário com os campos abaixo para edição
  function editOwner(owner) {
    setName(owner.name);
    setPhone(owner.phone);
    setAddress(owner.address);
    setEditingId(owner.id);
  }

  // Deleta dono
  function deleteOwner(id) {
    fetch(`http://localhost:3000/owners/${id}`, {
      method: "DELETE"
      //aqui recarrega a página depois de deletar
    }).then(() => window.location.reload());
  }


//aqui é o bloco que retorna o html --> o que o usuário vai ver
//aqui tem o formulário, a estrutura dele, e a lista de donos
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
{/* Botão que decide sozinho se Salva ---> novo ou Atualiza ---> edição */}
        <button>
          {editingId ? "Atualizar" : "Salvar"}
        </button>
      </form>
  {/* Lista que mostra todos os donos cadastrados */}
      <ul>
        {owners.map(owner => (
          <li key={owner.id}>
            {/* Mostra o Nome e o Telefone na lista */}
            {owner.name} - {owner.phone}
            {/* Botão que joga os dados lá pra cima para editar */}
            <button onClick={() => editOwner(owner)}>Editar</button>
            {/* Botão que apaga esse dono imediatamente */}
            <button onClick={() => deleteOwner(owner.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Owners;
