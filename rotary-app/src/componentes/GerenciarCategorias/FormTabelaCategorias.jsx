import Form from "react-bootstrap/Form";

function FormTabelaCategorias({
  categorias,
  onExcluirCategoria,
  onEditarCategoria,
  filtro,
  onFiltroChange,
}) {
  // calcula categorias filtradas
  const categoriasFiltradas = filtro
    ? categorias.filter(
        (c) =>
          c.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
          c.tipo?.toLowerCase().includes(filtro.toLowerCase()) ||
          c.descricao?.toLowerCase().includes(filtro.toLowerCase()) ||
          c.status?.toLowerCase().includes(filtro.toLowerCase())
      )
    : categorias;

  return (
    <div className="table-section">
      <div className="filter-container">
        <Form.Control
          type="text"
          placeholder="Filtrar categorias por nome, tipo ou descrição..."
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
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-table-message">
                  {filtro
                    ? "Nenhuma categoria encontrada para o filtro aplicado."
                    : "Nenhuma categoria cadastrada."}
                </td>
              </tr>
            ) : (
              categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nome}</td>
                  <td>{categoria.tipo}</td>
                  <td>{categoria.descricao}</td>
                  <td>{categoria.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => onEditarCategoria(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onExcluirCategoria(categoria.id)}
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

export default FormTabelaCategorias;