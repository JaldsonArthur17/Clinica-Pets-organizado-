import Owners from "./components/Owners";
import Pets from "./components/Pets";
import "./App.css";

// Componente principal da aplicação
function App() {
  return (
    <div className="container">
      <h1>Clínica de Pets</h1>

      {/* Seção de donos */}
      <Owners />

      {/* Seção de pets */}
      <Pets />
    </div>
  );
}

export default App;
