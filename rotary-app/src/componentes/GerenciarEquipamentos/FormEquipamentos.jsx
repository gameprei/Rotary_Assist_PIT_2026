import FormButton from "../shared/formButton.jsx";
import FormButtonSecondary from "../shared/FormButtonSecondary.jsx";
import FormInput from "../shared/FormInput.jsx";

function FormEquipamentos({
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
    "Cadeira de Rodas",
    "Cadeira de Banho"
  ];

  const estadosConservacao = [
    "Disponível",
    "Em uso",
    "Manutenção"
  ];

  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <h5>Dados do Equipamento</h5>

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
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            className={`form-control ${erros.tipo ? "is-invalid" : ""}`}
            value={formData.tipo}
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
            {erros.tipo || "Por favor, selecione o tipo do equipamento."}
          </div>
        </div>

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
      </div>

      <div className="form-row">
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

      <div className="form-group">
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          className={`form-control ${erros.descricao ? "is-invalid" : ""}`}
          rows="3"
          value={formData.descricao}
          onChange={(e) =>
            handleInputChange("descricao", e.target.value)
          }
          placeholder="Descrição do equipamento..."
          required
        />
        <div className="invalid-feedback">
          {erros.descricao ||
            "Por favor, informe a descrição do equipamento."}
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