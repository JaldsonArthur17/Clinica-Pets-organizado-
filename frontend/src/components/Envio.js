import { Link, useLocation } from "react-router-dom";

function Success() {
  const location = useLocation();
  // Pega a mensagem enviada pela tela anterior (ou usa uma padrão)
  const message = location.state?.message || "Operação realizada com sucesso!";
  // Pega o caminho de volta (ou volta para o início)
  const returnPath = location.state?.returnPath || "/";
  const returnText = location.state?.returnText || "Voltar ao Início";

  return (
    <div className="success-container">
      <div className="success-card">
        {/* Ícone de Check (feito com CSS puro ou emoji) */}
        <div className="check-icon">✓</div>

        <h2>Sucesso!</h2>
        <p>{message}</p>

        <Link to={returnPath} className="btn-back">
          {returnText}
        </Link>
      </div>
    </div>
  );
}

export default Success;
