import Form from "react-bootstrap/Form";

function FormTabelaMembros({
  membros,
  onExcluirMembro,
  onEditarMembro,
  filtro,
  onFiltroChange,
}) {
  // calcula membros filtrados
  const membrosFiltrados = filtro
    ? membros.filter(
        (m) =>
          m.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
          m.cpf?.includes(filtro) ||
          m.email?.toLowerCase().includes(filtro.toLowerCase()) ||
          m.cargo?.toLowerCase().includes(filtro.toLowerCase())
      )
    : membros;

  return (
    <div className="table-section">
      <div className="filter-container">
        <Form.Control
          type="text"
          placeholder="Filtrar membros por nome, CPF, email ou cargo..."
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
              <th>Cargo</th>
              <th>Ingresso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {membrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table-message">
                  {filtro ? "Nenhum membro encontrado para o filtro aplicado." : "Nenhum membro cadastrado."}
                </td>
              </tr>
            ) : (
              membrosFiltrados.map((membro) => (
                <tr key={membro.cpf}>
                  <td>
                    <strong>{membro.nome}</strong>
                  </td>
                  <td>{membro.cpf}</td>
                  <td>{membro.rg}</td>
                  <td>{membro.telefone}</td>
                  <td>
                    <span style={{ color: '#1e3c72' }}>
                      {membro.email}
                    </span>
                  </td>
                  <td>{membro.cargo}</td>
                  <td>{membro.data_ingresso}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja EDITAR o membro ${membro.nome}?`)) {
                          onEditarMembro(membro);
                        }
                      }}>
                      Editar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja EXCLUIR o membro ${membro.nome}?`)) {
                          onExcluirMembro(membro.cpf);
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

export default FormTabelaMembros;