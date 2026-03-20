import Form from "react-bootstrap/Form";

function FormTabelaEquipamentos({
  equipamentos,
  onExcluirEquipamento,
  onEditarEquipamento,
  filtro,
  onFiltroChange,
}) {
  // calcula equipamentos filtrados
  const equipamentosFiltrados = filtro
    ? equipamentos.filter(
        (e) =>
          e.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.patrimonio?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.numero_serie?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.categoria?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.estado_conservacao?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.status?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.data_aquisicao?.toLowerCase().includes(filtro.toLowerCase())
      )
    : equipamentos;

  return (
    <div className="table-section">
      <div className="filter-container">
        <Form.Control
          type="text"
          placeholder="Filtrar equipamentos por nome, patrimônio, tipo ou estado..."
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
              <th>Patrimônio</th>
              <th>Numero de Série</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Estado de conservação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-message">
                  {filtro
                    ? "Nenhum equipamento encontrado para o filtro aplicado."
                    : "Nenhum equipamento cadastrado."}
                </td>
              </tr>
            ) : (
              equipamentosFiltrados.map((equipamento) => (
                <tr key={equipamento.patrimonio}>
                  <td>
                    <strong>{equipamento.nome}</strong>
                  </td>
                  <td>{equipamento.patrimonio}</td>
                  <td>{equipamento.numero_serie}</td>
                  <td>{equipamento.categoria}</td>
                  <td>{equipamento.status}</td>
                  <td>{equipamento.estado_conservacao}</td>
                  <td className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Tem certeza que deseja EDITAR o equipamento ${equipamento.nome}?`
                          )
                        ) {
                          onEditarEquipamento(equipamento);
                        }
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Tem certeza que deseja EXCLUIR o equipamento ${equipamento.nome}?`
                          )
                        ) {
                          onExcluirEquipamento(equipamento.id);
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

export default FormTabelaEquipamentos;