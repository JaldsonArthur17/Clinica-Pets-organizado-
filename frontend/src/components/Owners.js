import { useEffect, useState } from "react";

function Owners() {
  // --- ESTADOS (Memória do Componente) ---
  const [owners, setOwners] = useState([]); // Lista que guarda os donos vindos do banco

  // Variáveis ligadas aos campos do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Controla se estamos criando (null) ou editando (ID do dono)
  const [editingId, setEditingId] = useState(null);

  // --- EFEITOS (Ao carregar a página) ---
  useEffect(() => {
    // Busca a lista de donos no Backend assim que a tela abre
    fetch("http://localhost:3000/owners")
      .then((res) => res.json())
      .then((data) => setOwners(data))
      .catch((error) => console.error("Erro ao buscar donos:", error));
  }, []);

  // --- FUNÇÕES DE AÇÃO ---

  // Função disparada ao clicar em Salvar/Atualizar
  function handleSubmit(e) {
    e.preventDefault(); // Evita que a página recarregue sozinha

    // Decide se é POST (criar novo) ou PUT (editar existente)
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/owners/${editingId}`
      : "http://localhost:3000/owners";

    // Envia os dados para o servidor
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
    }).then(() => {
      // Limpa os campos do formulário
      setName("");
      setPhone("");
      setAddress("");
      setEditingId(null);
      alert("Operação realizada com sucesso!");
      window.location.reload(); // Atualiza a tela para mostrar os dados novos
    });
  }

  // Preenche o formulário com os dados de um dono para edição
  function editOwner(owner) {
    setName(owner.name);
    setPhone(owner.phone);
    setAddress(owner.address || ""); // Se não tiver endereço, deixa vazio
    setEditingId(owner.id); // Avisa o sistema que estamos no modo de edição
  }

  // Deleta um dono
  function deleteOwner(id) {
    // Pergunta de segurança antes de apagar
    if (window.confirm("Tem certeza que deseja excluir este dono?")) {
      fetch(`http://localhost:3000/owners/${id}`, {
        method: "DELETE",
      }).then(() => window.location.reload());
    }
  }

  // --- O QUE APARECE NA TELA (JSX) ---
  return (
    <section>
      <h2>Gerenciar Donos</h2>

      {/* Formulário organizado (O CSS vai deixá-lo em grade/grid) */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required // Campo obrigatório segundo o PDF
        />

        <input
          placeholder="Telefone (ex: 11 99999-9999)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required // Campo obrigatório segundo o PDF
        />

        <input
          placeholder="Endereço (Opcional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* O botão muda o texto dependendo se está editando ou criando */}
        <button type="submit">
          {editingId ? "Atualizar Dono" : "Salvar Dono"}
        </button>
      </form>

      {/* Tabela de Listagem (Visual Profissional) */}
      <table className="crud-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>{owner.name}</td>
              <td>{owner.phone}</td>
              {/* Se não tiver endereço, mostra um tracinho "-" */}
              <td>{owner.address || "-"}</td>
              <td>
                <button className="btn-edit" onClick={() => editOwner(owner)}>
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteOwner(owner.id)}
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

export default Owners;
