import FormButton from "../shared/formButton.jsx";
import FormInput from "../shared/FormInput.jsx";

function FormFornecedores({
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

  const tiposPessoa = [
    { value: "PF", label: "Pessoa Física" },
    { value: "PJ", label: "Pessoa Jurídica" }
  ];

  const statusList = [
    "ATIVO",
    "INATIVO"
  ];

  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <h5>Informações do Fornecedor</h5> <br/>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipo_pessoa">Tipo de Pessoa:</label>
          <select
            id="tipo_pessoa"
            className={`form-control ${erros.tipo_pessoa ? "is-invalid" : ""}`}
            value={formData.tipo_pessoa || ""}
            onChange={(e) => handleInputChange("tipo_pessoa", e.target.value)}
            required
          >
            <option value="">Selecione o tipo</option>
            {tiposPessoa.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {erros.tipo_pessoa || "Por favor, selecione o tipo de pessoa."}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome do Fornecedor:</label>
          <FormInput
            id="nome"
            type="text"
            value={formData.nome || ""}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Nome do fornecedor"
            isInvalid={!!erros.nome}
            invalidFeedback={
              erros.nome || "Por favor, informe o nome do fornecedor."
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <FormInput
            id="cpf"
            type="text"
            value={formData.cpf || ""}
            onChange={(e) => handleInputChange("cpf", e.target.value)}
            placeholder="CPF do fornecedor (apenas para PF)"
            isInvalid={!!erros.cpf}
            disabled={formData.tipo_pessoa === "PJ"}
            invalidFeedback={
              erros.cpf || "Por favor, informe um CPF válido para pessoa física."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="cnpj">CNPJ:</label>
          <FormInput
            id="cnpj"
            type="text"
            value={formData.cnpj || ""}
            onChange={(e) => handleInputChange("cnpj", e.target.value)}
            placeholder="CNPJ do fornecedor (apenas para PJ)"
            isInvalid={!!erros.cnpj}
            disabled={formData.tipo_pessoa === "PF"}
            invalidFeedback={
              erros.cnpj || "Por favor, informe um CNPJ válido para pessoa jurídica."
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <FormInput
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Email do fornecedor"
            isInvalid={!!erros.email}
            invalidFeedback={erros.email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <FormInput
            id="telefone"
            type="text"
            value={formData.telefone || ""}
            onChange={(e) => handleInputChange("telefone", e.target.value)}
            placeholder="Telefone do fornecedor"
            isInvalid={!!erros.telefone}
            invalidFeedback={erros.telefone}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="endereco">Endereço:</label>
          <FormInput
            id="endereco"
            type="text"
            value={formData.endereco || ""}
            onChange={(e) => handleInputChange("endereco", e.target.value)}
            placeholder="Endereço do fornecedor"
            isInvalid={!!erros.endereco}
            invalidFeedback={erros.endereco}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bairro">Bairro:</label>
          <FormInput
            id="bairro"
            type="text"
            value={formData.bairro || ""}
            onChange={(e) => handleInputChange("bairro", e.target.value)}
            placeholder="Bairro"
            isInvalid={!!erros.bairro}
            invalidFeedback={erros.bairro}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cidade">Cidade:</label>
          <FormInput
            id="cidade"
            type="text"
            value={formData.cidade || ""}
            onChange={(e) => handleInputChange("cidade", e.target.value)}
            placeholder="Cidade"
            isInvalid={!!erros.cidade}
            invalidFeedback={erros.cidade}
          />
        </div>

        <div className="form-group">
          <label htmlFor="uf">UF:</label>
          <FormInput
            id="uf"
            type="text"
            value={formData.uf || ""}
            onChange={(e) => handleInputChange("uf", e.target.value)}
            placeholder="UF"
            maxLength="2"
            isInvalid={!!erros.uf}
            invalidFeedback={erros.uf}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cep">CEP:</label>
          <FormInput
            id="cep"
            type="text"
            value={formData.cep || ""}
            onChange={(e) => handleInputChange("cep", e.target.value)}
            placeholder="CEP"
            isInvalid={!!erros.cep}
            invalidFeedback={erros.cep}
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
            {statusList.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {erros.status || "Por favor, selecione o status do fornecedor."}
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
          {editando ? "Salvar Alterações" : "Cadastrar Fornecedor"}
        </FormButton>
      </div>
    </form>
  );
}

export default FormFornecedores;