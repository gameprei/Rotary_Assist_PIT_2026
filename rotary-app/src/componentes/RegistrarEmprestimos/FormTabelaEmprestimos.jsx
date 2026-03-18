import Form from "react-bootstrap/Form";

function FormTabelaEmprestimos({
    emprestimos,
    filtro,
    onFiltroChange,
    onEditarEmprestimo,
    onExcluirEmprestimo,
    onFinalizarEmprestimo
}) {
    const emprestimosFiltrados = filtro
        ? emprestimos.filter(
            (e) =>
                e.equipamento_nome?.toLowerCase().includes(filtro.toLowerCase()) ||
                e.beneficiario_nome?.toLowerCase().includes(filtro.toLowerCase()) ||
                e.beneficiario_cpf?.toLowerCase().includes(filtro.toLowerCase()) ||
                e.membro_nome?.toLowerCase().includes(filtro.toLowerCase()) ||
                e.data_emprestimo?.toLowerCase().includes(filtro.toLowerCase()) ||
                e.data_prevista_devolucao?.toLowerCase().includes(filtro.toLowerCase()) ||
                e.status?.toLowerCase().includes(filtro.toLowerCase())
        )
        : emprestimos;

    const formatarData = (dataString) => {
        if (!dataString) return "";
        if (dataString.includes("T")) {
            return dataString.split("T")[0];
        }
        return dataString;
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'ATIVO':
                return 'badge bg-success';
            case 'DEVOLVIDO':
                return 'badge bg-secondary';
            case 'ATRASADO':
                return 'badge bg-danger';
            case 'CANCELADO':
                return 'badge bg-warning';
            default:
                return 'badge bg-info';
        }
    };

    return (
        <div className="table-section">
            <div className="filter-container">
                <Form.Control
                    type="text"
                    placeholder="Filtrar empréstimos por equipamento, beneficiário, CPF, data ou status..."
                    value={filtro}
                    onChange={(e) => onFiltroChange(e.target.value)}
                    className="filter-input"
                />
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Equipamento</th>
                            <th>Beneficiário</th>
                            <th>CPF Beneficiário</th>
                            <th>Membro Responsável</th>
                            <th>Data Empréstimo</th>
                            <th>Data Prevista</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emprestimosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="empty-table-message">
                                    {filtro
                                        ? "Nenhum empréstimo encontrado para o filtro aplicado."
                                        : "Nenhum empréstimo registrado."}
                                </td>
                            </tr>
                        ) : (
                            emprestimosFiltrados.map((emprestimo) => (
                                <tr key={emprestimo.id}>
                                    <td>{emprestimo.equipamento_nome || emprestimo.equipamento}</td>
                                    <td>{emprestimo.beneficiario_nome || emprestimo.beneficiario}</td>
                                    <td>{emprestimo.beneficiario_cpf || "-"}</td>
                                    <td>{emprestimo.membro_nome || emprestimo.membro}</td>
                                    <td>{formatarData(emprestimo.data_emprestimo)}</td>
                                    <td>{formatarData(emprestimo.data_prevista_devolucao)}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(emprestimo.status)}>
                                            {emprestimo.status}
                                        </span>
                                    </td>

                                    {/* Será removido futuramente pois não será possível editar/ excluir nessa função*/}
                                    <td className="actions-column">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => onEditarEmprestimo(emprestimo)}
                                        >
                                            Editar
                                        </button>
                                        {emprestimo.status !== 'DEVOLVIDO' && (
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => onFinalizarEmprestimo(emprestimo.id)}
                                            >
                                                Devolver
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => onExcluirEmprestimo(emprestimo.id)}
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

export default FormTabelaEmprestimos;