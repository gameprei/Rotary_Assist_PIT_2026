import "./Header.css";

function Header({ activeTab, onChangeTab }) {
    return (
        <div className="prototype-container">
            <div className="header">
                <h1>🎡 RotaryAssist</h1>
                <p>Sistema de Gerenciamento de Equipamentos de Mobilidade</p>
            </div>

            <div className="nav-tabs">
                {[
                    "Login",
                    "Dashboard",
                    "Equipamentos",
                    "Beneficiários",
                    "Membros",
                    "Empréstimos",
                    "Devoluções",
                    "Relatórios",
                    "Manutenção",
                ].map((tab) => (
                    <button
                        key={tab}
                        className={`nav-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => onChangeTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Header;
