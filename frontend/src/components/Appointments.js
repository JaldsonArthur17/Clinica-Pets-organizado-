import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Appointments() {
  // --- ESTADOS (Variáveis de Memória) ---
  const [appointments, setAppointments] = useState([]); // Lista de consultas
  const [pets, setPets] = useState([]); // Lista de pets
  const navigate = useNavigate();

  // Variáveis do formulário
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [vetName, setVetName] = useState("");
  const [description, setDescription] = useState("");

  // --- EFEITOS (Ao carregar a página) ---
  useEffect(() => {
    // 1. Busca as Consultas
    fetch("http://localhost:3001/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Erro ao buscar consultas:", err));

    // 2. Busca os Pets
    fetch("http://localhost:3001/pets")
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Erro ao buscar pets:", err));
  }, []);

  // --- FUNÇÕES DE AÇÃO ---

  // Agendar uma nova consulta (POST)
  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3001/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pet_id: petId,
        date: date,
        veterinarian_name: vetName,
        description: description,
        status: "AGENDADA",
      }),
    }).then(() => {
      setPetId("");
      setDate("");
      setVetName("");
      setDescription("");

      navigate("/success", {
        state: {
          message: "Consulta agendada com sucesso!",
          returnPath: "/appointments",
          returnText: "Voltar para Consultas",
        },
      });
    });
  }

  // Atualizar o status da consulta (PUT) com tratamento de erro
  function updateStatus(id, newStatus, currentData) {
    fetch(`http://localhost:3001/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pet_id: currentData.pet_id,
        date: currentData.date,
        veterinarian_name: currentData.veterinarian_name,
        description: currentData.description,
        status: newStatus, // "REALIZADA" ou "CANCELADA"
      }),
    })
      .then(async (response) => {
        // Se o servidor devolver erro (ex: 500), pegamos a mensagem
        if (!response.ok) {
          const erroTexto = await response.text();
          throw new Error(erroTexto);
        }
        // Se deu certo, recarrega a página
        window.location.reload();
      })
      .catch((error) => {
        // MOSTRA O ERRO NA TELA (Agora saberemos o motivo!)
        console.error(error);
        alert("Erro ao atualizar status:\n" + error.message);
      });
  }

  // Funções auxiliares
  function getPetName(id) {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Pet Excluído/Desconhecido";
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleString("pt-BR");
  }

  // --- RENDERIZAÇÃO ---
  return (
    <section>
      <h2>Consultas Veterinárias</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required
        >
          <option value="">Selecione o Pet</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          placeholder="Nome do Veterinário"
          value={vetName}
          onChange={(e) => setVetName(e.target.value)}
          required
        />

        <input
          placeholder="Motivo / Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Agendar Consulta</button>
      </form>

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
              <td>{formatDate(app.date)}</td>
              <td>{getPetName(app.pet_id)}</td>
              <td>{app.veterinarian_name}</td>
              <td>{app.description || "-"}</td>
              <td>
                <span className={`status-${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </td>
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
