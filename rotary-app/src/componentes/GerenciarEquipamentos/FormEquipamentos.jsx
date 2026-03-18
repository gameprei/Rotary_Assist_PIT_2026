import FormButton from "../shared/formButton.jsx";
import FormButtonSecondary from "../shared/FormButtonSecondary.jsx";
import FormInput from "../shared/FormInput.jsx";

function FormEquipamentos({
  formData,
  onFormChange,
  onSubmit,
  erros,
  editando,
  onCancelar,
  categorias,
  fornecedores
}) {
  // Função genérica para atualizar qualquer campo
  const handleInputChange = (campo, valor) => {
    onFormChange(campo, valor);
  };

  const tipos = [
    "Cadeira de Rodas",
    "Cadeira de Banho"
  ];

  const estadosConservacao = [
    "Novo",
    "Usado - Bom",
    "Usado - Regular",
    "Usado - Ruim"
  ];



  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <h5>Informações do Equipamento</h5> <br/>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome do Equipamento:</label>
          <FormInput
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Nome do equipamento"
            isInvalid={!!erros.nome}
            invalidFeedback={
              erros.nome || "Por favor, informe o nome do equipamento."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <FormInput
            id="descricao"
            type="text"
            value={formData.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            placeholder="Breve descrição do equipamento"
            isInvalid={!!erros.descricao}
            invalidFeedback={
              erros.descricao || "Por favor, insira uma breve descrição do equipamento."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="patrimonio">Patrimônio:</label>
          <FormInput
            id="patrimonio"
            type="text"
            value={formData.patrimonio}
            onChange={(e) => handleInputChange("patrimonio", e.target.value)}
            placeholder="Número de patrimônio"
            isInvalid={!!erros.patrimonio}
            invalidFeedback={
              erros.patrimonio || "Por favor, informe o patrimônio."
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="numero_serie">Número de Série:</label>
          <FormInput
            id="numero_serie"
            type="text"
            value={formData.numero_serie}
            onChange={(e) => handleInputChange("numero_serie", e.target.value)}
            placeholder="Número de série"
            isInvalid={!!erros.numero_serie}
            invalidFeedback={
              erros.numero_serie || "Por favor, informe o número de série."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoria:</label>
          <select
            id="categoria"
            className={`form-control ${erros.categoria_id ? "is-invalid" : ""}`}
            value={formData.categoria_id}
            onChange={(e) => handleInputChange("categoria_id", e.target.value)}
            required
          >
            <option value="">Selecione a categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {erros.categoria_id || "Por favor, selecione a categoria do equipamento."}
          </div>
        </div>

        
        <div className="form-group">
          <label htmlFor="fornecedor">Fornecedor:</label>
          <select
            id="fornecedor"
            className={`form-control ${erros.fornecedor_id ? "is-invalid" : ""}`}
            value={formData.fornecedor_id}
            onChange={(e) =>
              handleInputChange("fornecedor_id", e.target.value)
            }
            required
          >
            <option value="">Selecione o fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {erros.fornecedor_id ||
              "Por favor, selecione o fornecedor."}
          </div>
        </div>
      </div>

      <div className="form-row">

        <div className="form-group">
          <label htmlFor="estado_conservacao">Estado de Conservação:</label>
          <select
            id="estado_conservacao"
            className={`form-control ${erros.estado_conservacao ? "is-invalid" : ""}`}
            value={formData.estado_conservacao}
            onChange={(e) =>
              handleInputChange("estado_conservacao", e.target.value)
            }
            required
          >
            <option value="">Selecione o estado</option>
            {estadosConservacao.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {erros.estado_conservacao ||
              "Por favor, selecione o estado de conservação."}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="data_aquisicao">Data de Aquisição:</label>
          <FormInput
            id="data_aquisicao"
            type="date"
            value={formData.data_aquisicao}
            onChange={(e) =>
              handleInputChange("data_aquisicao", e.target.value)
            }
            isInvalid={!!erros.data_aquisicao}
            invalidFeedback={
              erros.data_aquisicao ||
              "Por favor, informe a data de aquisição."
            }
          />
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
          {editando ? "Salvar Alterações" : "Cadastrar Equipamento"}
        </FormButton>
      </div>
    </form>
  );
}

export default FormEquipamentos;