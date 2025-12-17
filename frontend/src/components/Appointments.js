import { useEffect, useState } from "react";

function Appointments() {
  // --- ESTADOS (Variáveis de Memória) ---
  const [appointments, setAppointments] = useState([]); // Lista de consultas
  const [pets, setPets] = useState([]); // Lista de pets (para o select)

  // Variáveis do formulário
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [vetName, setVetName] = useState("");
  const [description, setDescription] = useState("");

  // --- EFEITOS (Ao carregar a página) ---
  useEffect(() => {
    // 1. Busca as Consultas
    fetch("http://localhost:3000/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Erro ao buscar consultas:", err));

    // 2. Busca os Pets (precisamos disso para mostrar o nome do pet e não só o ID)
    fetch("http://localhost:3000/pets")
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Erro ao buscar pets:", err));
  }, []);

  // --- FUNÇÕES DE AÇÃO ---

  // Agendar uma nova consulta (POST)
  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pet_id: petId,
        date: date, // O input manda formato ISO (YYYY-MM-DDTHH:MM)
        veterinarian_name: vetName,
        description: description,
        status: "AGENDADA", // Toda nova consulta começa agendada
      }),
    }).then(() => {
      alert("Consulta agendada com sucesso!");
      window.location.reload();
    });
  }

  // Atualizar o status da consulta (PUT) - Bônus do PDF
  function updateStatus(id, newStatus, currentData) {
    // O PDF pede update, então enviamos os dados antigos + o status novo
    fetch(`http://localhost:3000/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pet_id: currentData.pet_id,
        date: currentData.date,
        veterinarian_name: currentData.veterinarian_name,
        description: currentData.description,
        status: newStatus, // Aqui muda (REALIZADA ou CANCELADA)
      }),
    }).then(() => window.location.reload());
  }

  // Função auxiliar: Transforma o ID do pet (ex: 1) no Nome (ex: Rex)
  function getPetName(id) {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Pet Excluído/Desconhecido";
  }

  // Função auxiliar: Formata a data para ficar bonita (Dia/Mês/Ano Hora:Min)
  function formatDate(isoString) {
    return new Date(isoString).toLocaleString("pt-BR");
  }

  // --- RENDERIZAÇÃO (Tela) ---
  return (
    <section>
      <h2>Consultas Veterinárias</h2>

      {/* Formulário de Agendamento (Grade do CSS App.css) */}
      <form onSubmit={handleSubmit}>
        {/* Dropdown de Pets */}
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required // Obrigatório
        >
          <option value="">Selecione o Pet</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

        {/* Input de Data e Hora */}
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required // Obrigatório
        />

        <input
          placeholder="Nome do Veterinário"
          value={vetName}
          onChange={(e) => setVetName(e.target.value)}
          required // Obrigatório
        />

        <input
          placeholder="Motivo / Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Agendar Consulta</button>
      </form>

      {/* --- MELHORIA VISUAL: Tabela --- */}
      <table className="crud-table">
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Pet</th>
            <th>Veterinário</th>
            <th>Motivo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id}>
              {/* Data formatada */}
              <td>{formatDate(app.date)}</td>

              {/* Nome do Pet buscado pelo ID */}
              <td>{getPetName(app.pet_id)}</td>

              <td>{app.veterinarian_name}</td>
              <td>{app.description || "-"}</td>

              {/* Status com cor dinâmica (CSS .status-agendada, etc) */}
              <td>
                <span className={`status-${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </td>

              {/* Botões de Ação (Só aparecem se estiver AGENDADA) */}
              <td>
                {app.status === "AGENDADA" && (
                  <>
                    <button
                      style={{
                        backgroundColor: "#27ae60",
                        color: "white",
                        marginRight: "5px",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => updateStatus(app.id, "REALIZADA", app)}
                    >
                      Concluir
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => updateStatus(app.id, "CANCELADA", app)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {app.status !== "AGENDADA" && (
                  <span style={{ color: "#aaa", fontSize: "12px" }}>
                    Finalizada
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Appointments;
