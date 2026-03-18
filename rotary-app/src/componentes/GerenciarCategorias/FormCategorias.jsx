import FormButton from "../shared/formButton.jsx";
import FormInput from "../shared/FormInput.jsx";

function FormCategorias({
    formData,
    onFormChange,
    onSubmit,
    erros,
    editando,
    onCancelar
}) {
    // Função genérica para atualizar qualquer campo
    const handleInputChange = (campo, valor) => {
        onFormChange(campo, valor);
    };

    const tipos = [
        "Equipamento",
        "Fornecedor"
    ];

    const statusList = [
        "ATIVO",
        "INATIVO"
    ];

    return (
        <form className="needs-validation" noValidate onSubmit={onSubmit}>
            <h5>Informações da Categoria</h5>
            <br />

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="nome">Nome da Categoria:</label>
                    <FormInput
                        id="nome"
                        type="text"
                        value={formData.nome || ""}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        placeholder="Nome da categoria"
                        isInvalid={!!erros.nome}
                        invalidFeedback={
                            erros.nome || "Por favor, informe o nome da categoria."
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tipo">Tipo:</label>
                    <select
                        id="tipo"
                        className={`form-control ${erros.tipo ? "is-invalid" : ""}`}
                        value={formData.tipo || ""}
                        onChange={(e) => handleInputChange("tipo", e.target.value)}
                        required
                    >
                        <option value="">Selecione o tipo</option>
                        {tipos.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                    <div className="invalid-feedback">
                        {erros.tipo || "Por favor, selecione um tipo."}
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea
                        id="descricao"
                        className={`form-control ${erros.descricao ? "is-invalid" : ""}`}
                        rows="3"
                        value={formData.descricao || ""}
                        onChange={(e) => handleInputChange("descricao", e.target.value)}
                        placeholder="Descrição da categoria..."
                    />
                    <div className="invalid-feedback">
                        {erros.descricao || "Por favor, informe a descrição da categoria."}
                    </div>
                </div>

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
                        {statusList.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <div className="invalid-feedback">
                        {erros.status || "Por favor, selecione o status da categoria."}
                    </div>
                </div>
            </div>

            <div className="form-actions">
                {onCancelar && (
                    <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>
                )}
                <FormButton type="submit">
                    {editando ? "Salvar Alterações" : "Cadastrar Categoria"}
                </FormButton>
            </div>
        </form>
    );
}

export default FormCategorias;