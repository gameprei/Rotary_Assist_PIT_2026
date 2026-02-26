import { useState, useEffect } from "react";
import "../shared/App.css";
import BeneficiariosService from "../../services/BeneficiariosService.js";
import FormBeneficiarios from "./FormBeneficiarios.jsx";
import FormTabelaBeneficiarios from "./FormTabelaBeneficiarios.jsx";


function CadastrarBeneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "", 
    cep: "",
    contato_emergencia: "",
    telefone_emergencia: "",
    necessidade_especifica: "",
  });
  const [filtro, setFiltro] = useState("");
  const [erros, setErros] = useState({});
  const [editando, setEditando] = useState(false);
  const [beneficiarioEditando, setBeneficiarioEditando] = useState(null);

  // Carregar beneficiários com service
  const carregarBeneficiarios = async () => {
    try {
      const dados = await BeneficiariosService.listarTodos();
      setBeneficiarios(dados);
    } catch (error) {
      console.error("Erro ao carregar beneficiários:", error);
    }
  };

  // Carregar beneficiários na inicialização
  useEffect(() => {
    carregarBeneficiarios();
  }, []);

  // Salvar beneficiários utilizando service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    try {
      if (editando) {
        await BeneficiariosService.atualizar(
          beneficiarioEditando.cpf,
          formData
        );
        alert("Beneficiário atualizado com sucesso!");
      } else {
        await BeneficiariosService.cadastrar(formData);
        alert("Beneficiário cadastrado com sucesso!");
      }
      await carregarBeneficiarios();
      // Limpa o formulário após salvar
      setFormData({
        nome: "",
        cpf: "",
        rg: "",
        data_nascimento: "",
        telefone: "",
        email: "",
        endereco: "",
        bairro: "",
        cidade: "",
        uf: "", 
        cep: "",
        contato_emergencia: "",
        telefone_emergencia: "",
        necessidade_especifica: "",
      });
      setEditando(false);
      setBeneficiarioEditando(null);
      setErros({});
    } catch (error) {
      console.error("Erro ao salvar beneficiário:", error);
      alert(`Erro ao cadastrar beneficiario: ${error}`);
    }
  };

  // Excluir beneficiário utilizando service
  const excluirBeneficiario = async (cpf) => {
    try {
      await BeneficiariosService.excluir(cpf);
      await carregarBeneficiarios();
      alert("Beneficiário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir beneficiário:", error);
      alert("Erro ao excluir beneficiário. Tente novamente.");
    }
  };

  //editar beneficiário
  const editarBeneficiario = (beneficiario) => {
    const novosDados = {
      nome: beneficiario.nome || "",
      cpf: beneficiario.cpf || "",
      rg: beneficiario.rg || "",
      data_nascimento: beneficiario.data_nascimento || "",
      telefone: beneficiario.telefone || "",
      email: beneficiario.email || "",
      endereco: beneficiario.endereco || "",
      bairro: beneficiario.bairro || "",
      cidade: beneficiario.cidade || "",
      uf: beneficiario.uf || "",
      cep: beneficiario.cep || "",
      contato_emergencia: beneficiario.contato_emergencia || "",
      telefone_emergencia: beneficiario.telefone_emergencia || "",
      necessidade_especifica: beneficiario.necessidade_especifica || "",
    };

    setFormData(novosDados);
    setEditando(true);
    setBeneficiarioEditando(beneficiario);
    setErros({});

    // Rola a página para o topo para ver o formulário
    window.scrollTo(0, 0);
  };

  // Função genérica para atualizar qualquer campo
  const handleInputChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  /*Máscara CPF*/
  const aplicarMascaraCPF = (valor) => {
    valor = valor.replace(/\D/g, "").substring(0, 11);

    if (valor.length === 11) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return valor;
  };
  const handleCpfChange = (e) => {
    const cpfFormatado = aplicarMascaraCPF(e.target.value);
    setFormData({ ...formData, cpf: cpfFormatado });
  };

  /*Máscara RG*/
  const aplicarMascaraRG = (valor) => {
    valor = valor.replace(/\D/g, "").substring(0, 9);

    if (valor.length === 9) {
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    }
    return valor;
  };
  const handleRgChange = (e) => {
    const rgFormatado = aplicarMascaraRG(e.target.value);
    setFormData({ ...formData, rg: rgFormatado });
  };

  /*Máscara Data de Nascimento*/
  const aplicarMascaraData = (valor) => {
    valor = valor.replace(/\D/g, "").substring(0, 8);

    if (valor.length === 8) {
      return valor.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    } else if (valor.length >= 5) {
      return valor.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (valor.length >= 3) {
      return valor.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }
    return valor;
  };
  const handleDataNascimentoChange = (e) => {
    const dataFormatada = aplicarMascaraData(e.target.value);
    setFormData({ ...formData, data_nascimento: dataFormatada });
  };

  /* Máscara CEP */
  const aplicarMascaraCep = (valor) => {
    valor = valor.replace(/\D/g, "").substring(0, 8); // Limita a 8 dígitos

    if (valor.length === 8) {
      return valor.replace(/(\d{5})(\d{3})/, "$1-$2");
    } else if (valor.length >= 6) {
      return valor.replace(/(\d{5})(\d{0,3})/, "$1-$2");
    }
    return valor;
  };
  const handleCepChange = (e) => {
    const cepFormatado = aplicarMascaraCep(e.target.value);
    setFormData({ ...formData, cep: cepFormatado });
  };

  // Máscara Numero de Telefone
  const aplicarMascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, "").substring(0, 11);

    if (valor.length === 11) {
      return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return valor;
  };
  const handleTelefoneChange = (e) => {
    const telefoneFormatado = aplicarMascaraTelefone(e.target.value);
    setFormData({ ...formData, telefone: telefoneFormatado });
  };
  const handleTelefoneEmergenciaChange = (e) => {
    const telefoneFormatado = aplicarMascaraTelefone(e.target.value);
    setFormData({ ...formData, telefone_emergencia: telefoneFormatado });
  };

  // Validação do formulário
  const validarFormulario = () => {
    const novosErros = {};

    // Validar CPF (remove máscara para validar)
    const cpfSemMascara = formData.cpf.replace(/\D/g, "");
    if (!formData.cpf || cpfSemMascara.length !== 11) {
      novosErros.cpf = "CPF deve ter 11 dígitos";
    }

    // Validar CEP (remove máscara para validar)
    const cepSemMascara = formData.cep.replace(/\D/g, "");

    if (!formData.cep || cepSemMascara.length !== 8) {
      novosErros.cep = "CEP deve ter 8 dígitos";
    }

    // Validar Email
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      novosErros.email = "E-mail inválido";
    }

    // Validar RG (remove máscara para validar)
    const rgSemMascara = formData.rg.replace(/\D/g, "");
    if (!formData.rg || rgSemMascara.length < 6 || rgSemMascara.length > 9) {
      novosErros.rg = "RG deve ter entre 6 e 9 dígitos";
    }

    // Validar Telefone (remove máscara para validar)
    const telefoneSemMascara = formData.telefone.replace(/\D/g, "");
    if (!formData.telefone || telefoneSemMascara.length !== 11) {
      novosErros.telefone = "Telefone deve ter 11 dígitos";
    }

    // Validar Telefone de emergência (remove máscara para validar)
    const telefoneEmergenciaSemMascara = formData.telefone_emergencia.replace(/\D/g, "");
    if (!formData.telefone_emergencia || telefoneEmergenciaSemMascara.length !== 11) {
      novosErros.telefone_emergencia = "Telefone deve ter 11 dígitos";
    }

    // Validar UF (2 letras maiúsculas)
    if (!formData.uf || !/^[A-Z]{2}$/.test(formData.uf.toUpperCase())) {
      novosErros.uf = "UF deve ter 2 letras (ex: SP, RJ, MG)";
    }

    // Validar Data de Nascimento Verifica formato DD/MM/AAAA || Valida se a data é real || Bloqueia datas futuras
    const data = formData.data_nascimento;
    if (!data || !/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      novosErros.data_nascimento = "Data deve estar no formato DD/MM/AAAA";
    } else {
      const [dia, mes, ano] = data.split("/").map(Number);

      const dataObj = new Date(ano, mes - 1, dia);
      // Valida se a data existe
      const dataValida =
        dataObj.getFullYear() === ano &&
        dataObj.getMonth() === mes - 1 &&
        dataObj.getDate() === dia;

      if (!dataValida) {
        novosErros.data_nascimento = "Data inválida";
      } else {
        // Bloqueia datas futuras
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dataObj.setHours(0, 0, 0, 0);

        if (dataObj > hoje) {
          novosErros.data_nascimento = "Data não pode ser no futuro";
        }
      }
    }

    // Validar campos obrigatórios simples
    if (!formData.nome) novosErros.nome = "Nome completo é obrigatório";
    if (!formData.telefone) novosErros.telefone = "Telefone é obrigatório";
    if (!formData.email) novosErros.email = "Email é obrigatório";
    if (!formData.endereco) novosErros.endereco = "Endereço é obrigatório";
    if (!formData.bairro) novosErros.bairro = "Bairro é obrigatório";
    if (!formData.cidade) novosErros.cidade = "Cidade é obrigatória";
    if (!formData.uf) novosErros.uf = "UF é obrigatória";
    if (!formData.cep) novosErros.cep = "CEP é obrigatório";
    if (!formData.contato_emergencia)
      novosErros.contato_emergencia = "Contato de emergência é obrigatório";
    if (!formData.telefone_emergencia)
      novosErros.telefone_emergencia = "Telefone de emergência é obrigatório";
    if (!formData.necessidade_especifica)
      novosErros.necessidade_especifica =
        "Necessidade específica é obrigatória";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para limpar formulario
  const handleCancelar = () => {
    setFormData({
      nome: "",
      cpf: "",
      rg: "",
      data_nascimento: "",
      telefone: "",
      email: "",
      endereco: "",
      bairro: "",
      cidade: "",
      uf: "", 
      cep: "",
      contato_emergencia: "",
      telefone_emergencia: "",
      necessidade_especifica: "",
    });
    setEditando(false);
    setBeneficiarioEditando(null);
    setErros({});
  };

  // Renderização do componente
  return (
    <div id="beneficiaries" className="prototype-screen active">
      <div className="screen-frame">
        <div className="screen-header">
          <h3>Cadastro de Beneficiários</h3>
        </div>

        <div className="screen-content">
          <FormBeneficiarios
            formData={formData}
            onFormChange={handleInputChange}
            onSubmit={handleSubmit}
            erros={erros}
            onCpfChange={handleCpfChange}
            onRgChange={handleRgChange}
            onDataNascimentoChange={handleDataNascimentoChange}
            onTelefoneChange={handleTelefoneChange}
            onTelefoneEmergenciaChange={handleTelefoneEmergenciaChange}
            onCepChange={handleCepChange}
            editando={editando}
            onCancelar={handleCancelar}
          />
        </div>
      </div>
      <br></br>
      <div className="prototype-screen active">
        <div className="screen-frame">
          <div className="screen-header">
            <h3>Beneficiários Cadastrados</h3>
          </div>

          <FormTabelaBeneficiarios
            beneficiarios={beneficiarios}
            onExcluirBeneficiario={excluirBeneficiario}
            onEditarBeneficiario={editarBeneficiario}
            filtro={filtro}
            onFiltroChange={setFiltro}
          />
        </div>
      </div>
    </div>
  );
}

export default CadastrarBeneficiarios;
