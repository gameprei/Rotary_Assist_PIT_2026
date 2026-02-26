import FormButton from "../shared/formButton.jsx";
import FormButtonSecondary from "../shared/FormButtonSecondary.jsx";
import FormInput from "../shared/FormInput.jsx";


function FormMembros({
  formData,
  onFormChange,
  onSubmit,
  erros,
  editando,
  onCpfChange,
  onTelefoneChange,
  onCepChange,
  onDataNascimentoChange,
  onDataIngressoChange,
  onRgChange,
  onCancelar,
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
            placeholder="Nome completo do membro"
            isInvalid={!!erros.nome}
            invalidFeedback={erros.nome || "Por favor, informe o nome completo."}
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
              erros.data_nascimento || "Por favor, informe a data de nascimento."
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="profissao">Profissão:</label>
          <FormInput
            type="text"
            id="profissao"
            value={formData.profissao}
            onChange={(e) => handleInputChange("profissao", e.target.value)}
            placeholder="Profissão do membro"
            isInvalid={!!erros.profissao}
            invalidFeedback={erros.profissao || "Por favor, informe a profissão."}
          />
        </div>

        <div className="form-group">
          <label htmlFor="empresa">Empresa:</label>
          <FormInput
            type="text"
            id="empresa"
            value={formData.empresa}
            onChange={(e) => handleInputChange("empresa", e.target.value)}
            placeholder="Empresa onde trabalha"
            isInvalid={!!erros.empresa}
            invalidFeedback={erros.empresa || "Por favor, informe a empresa."}
          />
        </div>
      </div>

      <h5>Informações Rotary</h5>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="data_ingresso">Data de Ingresso:</label>
          <FormInput
            type="text"
            id="data_ingresso"
            value={formData.data_ingresso}
            onChange={onDataIngressoChange}
            isInvalid={!!erros.data_ingresso}
            placeholder="DD/MM/AAAA"
            invalidFeedback={
              erros.data_ingresso || "Por favor, informe a data de ingresso."
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="cargo">Cargo:</label>
          <FormInput
            type="text"
            id="cargo"
            value={formData.cargo}
            onChange={(e) => handleInputChange("cargo", e.target.value)}
            placeholder="Cargo no Rotary"
            isInvalid={!!erros.cargo}
            invalidFeedback={erros.cargo || "Por favor, informe o cargo."}
          />
        </div>
      </div>

      <h5>Contato</h5>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <FormInput
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="membro@email.com"
            isInvalid={!!erros.email}
            invalidFeedback={erros.email || "Por favor, informe um email válido."}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <FormInput
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={onTelefoneChange}
            placeholder="(18) 99999-9999"
            isInvalid={!!erros.telefone}
            invalidFeedback={erros.telefone || "Por favor, informe um telefone válido."}
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
            invalidFeedback={erros.endereco || "Por favor, informe o endereço completo."}
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
        <FormButton type="submit" placeholder="Cadastrar Membro" >
          {editando ? "Salvar Alterações" : "Cadastrar Membro"}
        </FormButton>
      </div>
    </form>
  );
}

export default FormMembros;
