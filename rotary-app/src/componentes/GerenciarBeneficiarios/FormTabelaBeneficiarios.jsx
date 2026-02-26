import Form from "react-bootstrap/Form";

function FormTabelaBeneficiarios({
  beneficiarios,
  onExcluirBeneficiario,
  onEditarBeneficiario,
  filtro,
  onFiltroChange,
}) {
  // calcula beneficiários filtrados
  const beneficiariosFiltrados = filtro
    ? beneficiarios.filter(
        (b) =>
          b.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
          b.cpf?.includes(filtro) ||
          b.email?.toLowerCase().includes(filtro.toLowerCase())
      )
    : beneficiarios;

  return (
    <div className="table-section">
      <div className="filter-container">
        <Form.Control
          type="text"
          placeholder="Filtrar beneficiários por nome, CPF ou email..."
          value={filtro}
          onChange={(e) => onFiltroChange(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {beneficiariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-message">
                  {filtro ? "Nenhum beneficiário encontrado para o filtro aplicado." : "Nenhum beneficiário cadastrado."}
                </td>
              </tr>
            ) : (
              beneficiariosFiltrados.map((beneficiario) => (
                <tr key={beneficiario.cpf}>
                  <td>
                    <strong>{beneficiario.nome}</strong>
                  </td>
                  <td>{beneficiario.cpf}</td>
                  <td>{beneficiario.rg}</td>
                  <td>{beneficiario.telefone}</td>
                  <td>
                    <span style={{ color: '#1e3c72' }}>
                      {beneficiario.email}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja EDITAR o beneficiário ${beneficiario.nome}?`)) {
                          onEditarBeneficiario(beneficiario);
                        }
                      }}>
                    
                      Editar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja EXCLUIR o beneficiário ${beneficiario.nome}?`)) {
                          onExcluirBeneficiario(beneficiario.cpf);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FormTabelaBeneficiarios;