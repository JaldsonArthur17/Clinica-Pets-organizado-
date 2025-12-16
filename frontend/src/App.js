import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Owners from "./components/Owners";
import Pets from "./components/Pets";
import Appointments from "./components/Appointments";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>Clínica de Pets</h1>
          {/* Menu de Navegação */}
          <nav
            style={{
              marginBottom: "20px",
              padding: "10px",
              background: "#f0f0f0",
            }}
          >
            <Link to="/owners" style={{ marginRight: "15px" }}>
              Donos
            </Link>
            <Link to="/pets" style={{ marginRight: "15px" }}>
              Pets
            </Link>
            <Link to="/appointments">Consultas</Link>
          </nav>
        </header>

        {/* Aqui definimos qual componente aparece em qual URL */}
        <Routes>
          {/* Rota inicial redireciona ou mostra algo. Aqui deixei Donos como padrão */}
          <Route path="/" element={<Owners />} />

          <Route path="/owners" element={<Owners />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
