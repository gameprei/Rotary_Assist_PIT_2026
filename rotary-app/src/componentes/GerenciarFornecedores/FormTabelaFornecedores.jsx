import Form from "react-bootstrap/Form";

function FormTabelaFornecedores({
    fornecedores,
    onExcluirFornecedor,
    onEditarFornecedor,
    filtro,
    onFiltroChange
}) {
  // calcula fornecedores filtrados
  const fornecedoresFiltrados = filtro
    ? fornecedores.filter(
        (f) =>
          f.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.cpf?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.cnpj?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.email?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.telefone?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.endereco?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.bairro?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.cidade?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.uf?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.cep?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.status?.toLowerCase().includes(filtro.toLowerCase())
      )
    : fornecedores;

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'ATIVO':
                return 'badge bg-success';
            case 'INATIVO':
                return 'badge bg-warning';
        }
    };

  return (
    <div className="table-section">
      <div className="filter-container">
        <Form.Control
          type="text"
          placeholder="Filtrar fornecedores por nome, CPF, CNPJ, email, telefone, endereço ou status..."
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
              <th>CPF/CNPJ</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cidade/UF</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table-message">
                  {filtro
                    ? "Nenhum fornecedor encontrado para o filtro aplicado."
                    : "Nenhum fornecedor cadastrado."}
                </td>
              </tr>
            ) : (
              fornecedoresFiltrados.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td>
                    <strong>{fornecedor.nome}</strong>
                  </td>
                  <td>{fornecedor.tipo_pessoa === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</td>
                  <td>{fornecedor.cpf || fornecedor.cnpj || "-"}</td>
                  <td>{fornecedor.email || "-"}</td>
                  <td>{fornecedor.telefone || "-"}</td>
                  <td>{fornecedor.cidade}/{fornecedor.uf}</td>
                  <td>
                    <span className={getStatusBadgeClass(fornecedor.status)}>{fornecedor.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        if (window.confirm(`Deseja editar o fornecedor ${fornecedor.nome}?`)) {
                          onEditarFornecedor(fornecedor);
                        }
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onExcluirFornecedor(fornecedor.id)}
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

export default FormTabelaFornecedores;