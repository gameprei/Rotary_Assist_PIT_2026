import FormButton from "../shared/formButton.jsx";
import FormInput from "../shared/FormInput.jsx";

function FormEmprestimos({
    formData,
    onFormChange,
    onSubmit,
    editando,
    erros,
    onCancelar,
    equipamentos // Adicionar esta prop
}) {
    // Função genérica para atualizar qualquer campo
    const handleInputChange = (campo, valor) => {
        onFormChange(campo, valor);
    };

    return (
        <form className="needs-validation" noValidate onSubmit={onSubmit}>
            <h5>Informações do Empréstimo</h5>
            <br />

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="equipamento_id">Equipamento:</label>
                    <select
                        id="equipamento_id"
                        className={`form-control ${erros.equipamento_id ? "is-invalid" : ""}`}
                        value={formData.equipamento_id || ""}
                        onChange={(e) => handleInputChange("equipamento_id", e.target.value)}
                        required
                    >
                        <option value="">Selecione o equipamento</option>
                        {equipamentos && equipamentos.map((equipamento) => (
                            <option key={equipamento.id} value={equipamento.id}>
                                {equipamento.nome} - {equipamento.patrimonio}
                            </option>
                        ))}
                    </select>
                    <div className="invalid-feedback">
                        {erros.equipamento_id || "Por favor, selecione o equipamento."}
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="beneficiario_cpf">CPF do Beneficiário:</label>
                    <FormInput
                        id="beneficiario_cpf"
                        type="text"
                        value={formData.beneficiario_cpf || ""}
                        onChange={(e) => handleInputChange("beneficiario_cpf", e.target.value)}
                        placeholder="CPF do beneficiário"
                        isInvalid={!!erros.beneficiario_cpf}
                        invalidFeedback={
                            erros.beneficiario_cpf || "Por favor, informe o CPF do beneficiário."
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="membro_cpf">CPF do Membro Responsável:</label>
                    <FormInput
                        id="membro_cpf"
                        type="text"
                        value={formData.membro_cpf || ""}
                        onChange={(e) => handleInputChange("membro_cpf", e.target.value)}
                        placeholder="CPF do membro responsável"
                        isInvalid={!!erros.membro_cpf}
                        invalidFeedback={
                            erros.membro_cpf || "Por favor, informe o CPF do membro responsável."
                        }
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="data_emprestimo">Data do Empréstimo:</label>
                    <FormInput
                        id="data_emprestimo"
                        type="date"
                        value={formData.data_emprestimo || ""}
                        onChange={(e) => handleInputChange("data_emprestimo", e.target.value)}
                        isInvalid={!!erros.data_emprestimo}
                        invalidFeedback={
                            erros.data_emprestimo || "Por favor, informe a data do empréstimo."
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="data_prevista_devolucao">Data prevista de devolução:</label>
                    <FormInput
                        id="data_prevista_devolucao"
                        type="date"
                        value={formData.data_prevista_devolucao || ""}
                        onChange={(e) => handleInputChange("data_prevista_devolucao", e.target.value)}
                        isInvalid={!!erros.data_prevista_devolucao}
                        invalidFeedback={
                            erros.data_prevista_devolucao || "Por favor, informe a data prevista de devolução."
                        }
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        className={`form-control ${erros.status ? "is-invalid" : ""}`}
                        value={formData.status || ""}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        required
                    >
                        <option value="">Selecione o status</option>
                        <option value="ATIVO">ATIVO</option>
                        <option value="DEVOLVIDO">DEVOLVIDO</option>
                        <option value="ATRASADO">ATRASADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                    </select>
                    <div className="invalid-feedback">
                        {erros.status || "Por favor, selecione o status do empréstimo."}
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="observacoes">Observações:</label>
                    <textarea
                        id="observacoes"
                        className={`form-control ${erros.observacoes ? "is-invalid" : ""}`}
                        rows="3"
                        value={formData.observacoes || ""}
                        onChange={(e) => handleInputChange("observacoes", e.target.value)}
                        placeholder="Observações sobre o empréstimo"
                    />
                    <div className="invalid-feedback">
                        {erros.observacoes}
                    </div>
                </div>
            </div>

            <div className="form-actions">
                {onCancelar && (
                    <button type="button" className="btn btn-secondary me-2" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <FormButton type="submit">
                    {editando ? "Atualizar Empréstimo" : "Registrar Empréstimo"}
                </FormButton>
            </div>
        </form>
    );
}

export default FormEmprestimos;