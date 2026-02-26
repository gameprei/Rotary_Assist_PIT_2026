import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import CadastrarBeneficiarios from './GerenciarBeneficiarios/CadastrarBeneficiarios.jsx'
import CadastrarMembros from './GerenciarMembros/CadastrarMembros.jsx'
import CadastrarEquipamentos from './GerenciarEquipamentos/CadastrarEquipamentos.jsx'

import Header from './shared/Header.jsx'

function App() {
  const [activeTab, setActiveTab] = useState("Membros");

  return (
    <>
      {/* Header controla qual aba está ativa */}
      <Header activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Renderização condicional das telas */}
      {activeTab === "Membros" && <CadastrarMembros />}
      {activeTab === "Beneficiários" && <CadastrarBeneficiarios />}

      {/* Outras telas futuras */}
      {activeTab === "Dashboard" && <div>Dashboard</div>}
      {activeTab === "Login" && <div>Página de Login</div>}
      {activeTab === "Equipamentos" && <CadastrarEquipamentos />} 
      {activeTab === "Relatórios" && <div>Relatórios aqui</div>}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
