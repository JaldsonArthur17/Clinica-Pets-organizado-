import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Owners from "./components/Owners";
import Pets from "./components/Pets";
import Appointments from "./components/Appointments";
import Envio from "./components/Envio";
import "./App.css";

function App() {
  return (
    // BrowserRouter habilita o sistema de rotas no React
    <BrowserRouter>
      <div className="container">

        <header>
          <h1>Clínica de Pets</h1>

          {/* Menu de navegação */}
          <nav>
            <Link to="/owners">Donos</Link>
            <Link to="/pets">Pets</Link>
            <Link to="/appointments">Consultas</Link>
          </nav>
        </header>

        <Routes> {/* usado para definir qual página deve ser exibida (por padrão está a página de donos) */}
          {/* Rota inicial */}
          <Route path="/" element={<Owners />} />

          <Route path="/owners" element={<Owners />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/success" element={<Envio />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
