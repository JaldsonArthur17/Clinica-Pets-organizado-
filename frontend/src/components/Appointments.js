import { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);

  // Campos do formulário
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [vetName, setVetName] = useState("");
  const [description, setDescription] = useState("");

  // Carrega consultas e pets ao iniciar
  useEffect(() => {
    fetch("http://localhost:3000/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data));

    fetch("http://localhost:3000/pets")
      .then((res) => res.json())
      .then((data) => setPets(data));
  }, []);

  // Cria nova consulta
  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pet_id: petId,
        date: date, // O input datetime-local já manda no formato ISO ou parecido
        veterinarian_name: vetName,
        description: description,
        status: "AGENDADA",
      }),
    }).then(() => {
      window.location.reload();
    });
  }

  // Função para alterar status (Bônus do PDF)
  function updateStatus(id, newStatus, currentData) {
    // Precisamos enviar todos os dados obrigatórios no PUT,
    // então reaproveitamos o que já está salvo no objeto 'currentData'
    fetch(`http://localhost:3000/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pet_id: currentData.pet_id,
        date: currentData.date,
        veterinarian_name: currentData.veterinarian_name,
        description: currentData.description,
        status: newStatus,
      }),
    }).then(() => window.location.reload());
  }

  // Função auxiliar para mostrar o nome do Pet em vez do ID
  function getPetName(id) {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Desconhecido";
  }

  return (
    <section>
      <h2>Consultas Veterinárias</h2>

      {/* Formulário de Agendamento */}
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
          placeholder="Descrição/Motivo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button>Agendar</button>
      </form>

      {/* Lista de Consultas */}
      <ul>
        {appointments.map((app) => (
          <li
            key={app.id}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <strong>{new Date(app.date).toLocaleString()}</strong> -{" "}
            {getPetName(app.pet_id)}
            <br />
            Vet: {app.veterinarian_name} | Motivo: {app.description}
            <br />
            Status: <strong>{app.status}</strong>
            <br />
            {/* Botões para mudar status (Requisito do PDF) */}
            {app.status === "AGENDADA" && (
              <>
                <button onClick={() => updateStatus(app.id, "REALIZADA", app)}>
                  Concluir
                </button>
                <button onClick={() => updateStatus(app.id, "CANCELADA", app)}>
                  Cancelar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Appointments;
