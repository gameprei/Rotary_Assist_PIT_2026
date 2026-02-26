import FormButton from "../shared/formButton.jsx"; 
import FormButtonSecondary from "../shared/FormButtonSecondary.jsx";
import FormInput from "../shared/FormInput.jsx";


function FormBeneficiarios({
  formData,
  onFormChange,
  onSubmit,
  erros,
  onCpfChange,
  onRgChange,
  onDataNascimentoChange,
  editando,
  onTelefoneChange,
  onCepChange,
  onTelefoneEmergenciaChange,
  onCancelar
  
}) {
  // Função genérica para atualizar qualquer campo
  const handleInputChange = (campo, valor) => {
    onFormChange(campo, valor);
  };

  // Lista de UFs
  const ufs = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <h5>Dados Pessoais</h5>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo:</label>
          <FormInput
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Nome completo do beneficiário"
            isInvalid={!!erros.nome}
            invalidFeedback={
              erros.nome || "Por favor, informe o nome completo."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <FormInput
            type="text"
            id="cpf"
            value={formData.cpf}
            onChange={onCpfChange}
            isInvalid={!!erros.cpf}
            placeholder="000.000.000-00"
            invalidFeedback={erros.cpf || "Por favor, informe um CPF válido."}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rg">RG:</label>
          <FormInput
            type="text"
            id="rg"
            value={formData.rg}
            onChange={onRgChange}
            isInvalid={!!erros.rg}
            placeholder="00.000.000-0"
            invalidFeedback={erros.rg || "Por favor, informe um RG válido."}
          />
        </div>

        <div className="form-group">
          <label htmlFor="data_nascimento">Data de Nascimento:</label>
          <FormInput
            type="text"
            id="data_nascimento"
            value={formData.data_nascimento}
            onChange={onDataNascimentoChange}
            isInvalid={!!erros.data_nascimento}
            placeholder="DD/MM/AAAA"
            invalidFeedback={
              erros.data_nascimento ||
              "Por favor, informe a data de nascimento."
            }
          />
        </div>
      </div>

      <h5>Contato</h5>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <FormInput
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={onTelefoneChange}
            placeholder="(18) 9999-9999"
            isInvalid={!!erros.telefone}
            invalidFeedback={
              erros.telefone || "Por favor, informe um telefone válido."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <FormInput
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="beneficiario@email.com"
            isInvalid={!!erros.email}
            invalidFeedback={
              erros.email || "Por favor, informe um email válido."
            }
          />
        </div>
      </div>

      <h5>Endereço</h5>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="endereco">Endereço Completo:</label>
          <FormInput
            type="text"
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleInputChange("endereco", e.target.value)}
            placeholder="Rua, número, complemento"
            isInvalid={!!erros.endereco}
            invalidFeedback={
              erros.endereco || "Por favor, informe o endereço completo."
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="bairro">Bairro:</label>
          <FormInput
            type="text"
            id="bairro"
            value={formData.bairro}
            onChange={(e) => handleInputChange("bairro", e.target.value)}
            placeholder="Nome do bairro"
            isInvalid={!!erros.bairro}
            invalidFeedback={erros.bairro || "Por favor, informe o bairro."}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cidade">Cidade:</label>
          <FormInput
            type="text"
            id="cidade"
            value={formData.cidade}
            onChange={(e) => handleInputChange("cidade", e.target.value)}
            placeholder="Nome da cidade"
            isInvalid={!!erros.cidade}
            invalidFeedback={erros.cidade || "Por favor, informe a cidade."}
          />
        </div>
        <div className="form-group">
          <label htmlFor="uf">UF:</label>
          <select
            id="uf"
            className={`form-control ${erros.uf ? "is-invalid" : ""}`}
            value={formData.uf}
            onChange={(e) => handleInputChange("uf", e.target.value.toUpperCase())}
            required
          >
            <option value="">Selecione a UF</option>
            {ufs.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {erros.uf || "Por favor, selecione a UF."}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cep">CEP:</label>
          <FormInput
            type="text"
            id="cep"
            value={formData.cep}
            onChange={onCepChange}
            placeholder="00000-000"
            isInvalid={!!erros.cep}
            invalidFeedback={erros.cep || "Por favor, informe um CEP válido."}
          />
        </div>
      </div>

      <h5>Contato de Emergência</h5>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contato_emergencia">Nome:</label>
          <FormInput
                            placeholder="Nome do contato de emergência"
            isInvalid={!!erros.contato_emergencia}
            invalidFeedback={
              erros.contato_emergencia ||
              "Por favor, informe o nome do contato de emergência."
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefone_emergencia">Telefone:</label>
          <FormInput
            type="tel"
            id="telefone_emergencia"
            value={formData.telefone_emergencia}
            onChange={onTelefoneEmergenciaChange}
            placeholder="(18) 9999-9999"
            isInvalid={!!erros.telefone_emergencia}
            invalidFeedback={
              erros.telefone_emergencia ||
              "Por favor, informe um telefone de emergência válido."
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="necessidade_especifica">Necessidade Específica:</label>
        <textarea
          id="necessidade_especifica"
          className={`form-control ${
            erros.necessidade_especifica ? "is-invalid" : ""
          }`}
          rows="3"
          value={formData.necessidade_especifica}
          onChange={(e) =>
            handleInputChange("necessidade_especifica", e.target.value)
          }
          placeholder="Descreva a necessidade específica do beneficiário..."
          required
        />
        <div className="invalid-feedback">
          {erros.necessidade_especifica ||
            "Por favor, descreva a necessidade específica do beneficiário."}
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
        <FormButton type="submit" placeholder="Cadastrar Beneficiário" >
          {editando ? "Salvar Alterações" : "Cadastrar Beneficiário"}
        </FormButton>
      </div>
    </form>
  );
}

export default FormBeneficiarios;
