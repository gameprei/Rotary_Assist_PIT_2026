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
          e.tipo?.toLowerCase().includes(filtro.toLowerCase()) ||
          e.estado_conservacao?.toLowerCase().includes(filtro.toLowerCase())
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
              <th>Tipo</th>
              <th>Estado</th>
              <th>Data de Aquisição</th>
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
                  <td>{equipamento.tipo}</td>
                  <td>
                    <span style={{ color: "#1e3c72" }}>
                      {equipamento.estado_conservacao}
                    </span>
                  </td>
                  <td>{equipamento.data_aquisicao}</td>
                  <td>
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
                          onExcluirEquipamento(equipamento.patrimonio);
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