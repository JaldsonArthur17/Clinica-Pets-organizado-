import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Owners from "./components/Owners";
import Pets from "./components/Pets";
import Appointments from "./components/Appointments";
import Envio from "./components/Envio";
import "./App.css"; // Garanta que o CSS novo está salvo neste arquivo

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>Clínica de Pets</h1>

          {/* AQUI ESTÁ A MUDANÇA: Removemos todos os 'style={{...}}' */}
          {/* O arquivo App.css agora controla a beleza deste menu */}
          <nav>
            <Link to="/owners">Donos</Link>
            <Link to="/pets">Pets</Link>
            <Link to="/appointments">Consultas</Link>
          </nav>
        </header>

        <Routes>
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
