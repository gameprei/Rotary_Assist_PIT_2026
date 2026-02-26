import { useState, useEffect } from "react";
import "../shared/App.css";
import MembrosService from "../../services/MembrosService.js";
import FormMembros from "./FormMembros.jsx";
import FormTabelaMembros from "./FormTabelaMembros.jsx";


function CadastrarMembros() {
  const [membros, setMembros] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    email: "",
    telefone: "",
    data_nascimento: "",
    data_ingresso: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    cargo: "",
    profissao: "",
    empresa: "",
  });
  const [filtro, setFiltro] = useState("");
  const [erros, setErros] = useState({});
  const [editando, setEditando] = useState(false);
  const [membroEditando, setMembroEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Carregar membros com service
  const carregarMembros = async () => {
    setCarregando(true);
    try {
      const dados = await MembrosService.listarTodos();
      setMembros(dados);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      alert("Erro ao carregar membros.");
    } finally {
      setCarregando(false);
    }
  };

  // Carregar membros na inicialização
  useEffect(() => {
    carregarMembros();
  }, []);

  // Salvar membros utilizando service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    setCarregando(true);
    try {
      if (editando) {
        await MembrosService.atualizar(membroEditando.cpf, formData);
        alert("Membro atualizado com sucesso!");
      } else {
        await MembrosService.cadastrar(formData);
        alert("Membro cadastrado com sucesso!");
      }
      await carregarMembros();
      // Limpa o formulário após salvar
      setFormData({
        nome: "",
        cpf: "",
        rg: "",
        email: "",
        telefone: "",
        data_nascimento: "",
        data_ingresso: "",
        endereco: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        cargo: "",
        profissao: "",
        empresa: "",
      });
      setEditando(false);
      setMembroEditando(null);
      setErros({});
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
      alert(`Erro ao salvar membro: ${error.message || "Tente novamente."}`);
    } finally {
      setCarregando(false);
    }
  };

  // Excluir membro utilizando service
  const excluirMembro = async (cpf) => {
    try {
      await MembrosService.excluir(cpf);
      await carregarMembros();
      alert("Membro excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
      alert(`Erro ao excluir membro: ${error.message || "Tente novamente."}`);
    }
  };

  // Editar membro
  const editarMembro = (membro) => {
    const novosDados = {
      nome: membro.nome || "",
      cpf: membro.cpf || "",
      rg: membro.rg || "",
      email: membro.email || "",
      telefone: membro.telefone || "",
      data_nascimento: membro.data_nascimento || "",
      data_ingresso: membro.data_ingresso || "",
      endereco: membro.endereco || "",
      bairro: membro.bairro || "",
      cidade: membro.cidade || "",
      uf: membro.uf || "", 
      cep: membro.cep || "",
      cargo: membro.cargo || "",
      profissao: membro.profissao || "",
      empresa: membro.empresa || "",
    };

    setFormData(novosDados);
    setEditando(true);
    setMembroEditando(membro);
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

  /*Máscara Telefone*/
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

  /*Máscara CEP*/
  const aplicarMascaraCEP = (valor) => {
    valor = valor.replace(/\D/g, "").substring(0, 8);
    if (valor.length === 8) {
      return valor.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return valor;
  };

  const handleCepChange = (e) => {
    const cepFormatado = aplicarMascaraCEP(e.target.value);
    setFormData({ ...formData, cep: cepFormatado });
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

  const handleDataIngressoChange = (e) => {
    const dataFormatada = aplicarMascaraData(e.target.value);
    setFormData({ ...formData, data_ingresso: dataFormatada });
  };

  // Validação do formulário
  const validarFormulario = () => {
    const novosErros = {};

    // Validar CPF
    const cpfSemMascara = formData.cpf.replace(/\D/g, "");
    if (!formData.cpf || cpfSemMascara.length !== 11) {
      novosErros.cpf = "CPF deve ter 11 dígitos";
    }

    // Validar RG
    const rgSemMascara = formData.rg.replace(/\D/g, "");
    if (!formData.rg || rgSemMascara.length < 6 || rgSemMascara.length > 9) {
      novosErros.rg = "RG deve ter entre 6 e 9 dígitos";
    }

    // Validar CEP
    const cepSemMascara = formData.cep.replace(/\D/g, "");
    if (!formData.cep || cepSemMascara.length !== 8) {
      novosErros.cep = "CEP deve ter 8 dígitos";
    }

    // Validar UF
    if (!formData.uf || !/^[A-Z]{2}$/.test(formData.uf.toUpperCase())) {
      novosErros.uf = "UF deve ter 2 letras (ex: SP, RJ, MG)";
    }

    // Validar Email
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      novosErros.email = "E-mail inválido";
    }

    // Validar Telefone
    const telefoneSemMascara = formData.telefone.replace(/\D/g, "");
    if (!formData.telefone || telefoneSemMascara.length !== 11) {
      novosErros.telefone = "Telefone deve ter 11 dígitos";
    }

    // Validar Data de Nascimento
    const validarData = (data, campoNome) => {
      if (!data || !/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
        return `${campoNome} deve estar no formato DD/MM/AAAA`;
      } else {
        const [dia, mes, ano] = data.split("/").map(Number);
        const dataObj = new Date(ano, mes - 1, dia);
        const dataValida =
          dataObj.getFullYear() === ano &&
          dataObj.getMonth() === mes - 1 &&
          dataObj.getDate() === dia;

        if (!dataValida) {
          return `${campoNome} inválida`;
        } else {
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          dataObj.setHours(0, 0, 0, 0);

          if (campoNome === "Data de nascimento" && dataObj > hoje) {
            return "Data de nascimento não pode ser no futuro";
          }
        }
      }
      return null;
    };

    const erroDataNasc = validarData(formData.data_nascimento, "Data de nascimento");
    if (erroDataNasc) novosErros.data_nascimento = erroDataNasc;

    const erroDataIngr = validarData(formData.data_ingresso, "Data de ingresso");
    if (erroDataIngr) novosErros.data_ingresso = erroDataIngr;

    // Validar campos obrigatórios
    const camposObrigatorios = {
      nome: "Nome completo é obrigatório",
      telefone: "Telefone é obrigatório",
      email: "Email é obrigatório",
      endereco: "Endereço é obrigatório",
      bairro: "Bairro é obrigatório",
      cidade: "Cidade é obrigatória",
      uf: "UF é obrigatória",
      cep: "CEP é obrigatório",
      cargo: "Cargo é obrigatório",
      profissao: "Profissão é obrigatória",
      empresa: "Empresa é obrigatória",
    };

    Object.entries(camposObrigatorios).forEach(([campo, mensagem]) => {
      if (!formData[campo]) novosErros[campo] = mensagem;
    });

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para limpar formulário
  const handleCancelar = () => {
    setFormData({
      nome: "",
      cpf: "",
      rg: "",
      email: "",
      telefone: "",
      data_nascimento: "",
      data_ingresso: "",
      endereco: "",
      bairro: "",
      cidade: "",
      uf: "", 
      cep: "",
      cargo: "",
      profissao: "",
      empresa: "",
    });
    setEditando(false);
    setMembroEditando(null);
    setErros({});
  };

  return (
    <div id="membros-rotary" className="prototype-screen active">
      <div className="screen-frame">
        <div className="screen-header">
          <h3>Cadastro de Membros Rotary</h3>
        </div>

        <div className="screen-content">
          {carregando ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando dados...</p>
            </div>
          ) : (
            <FormMembros
              formData={formData}
              onFormChange={handleInputChange}
              onSubmit={handleSubmit}
              erros={erros}
              editando={editando}
              onCpfChange={handleCpfChange}
              onRgChange={handleRgChange}
              onTelefoneChange={handleTelefoneChange}
              onCepChange={handleCepChange}
              onDataNascimentoChange={handleDataNascimentoChange}
              onDataIngressoChange={handleDataIngressoChange}
              onCancelar={handleCancelar}
            />
          )}
        </div>
      </div>
      <br></br>
      <div className="prototype-screen active">
        <div className="screen-frame">
          <div className="screen-header">
            <h3>Membros Cadastrados</h3>
          </div>

          
            <FormTabelaMembros
              membros={membros}
              onExcluirMembro={excluirMembro}
              onEditarMembro={editarMembro}
              filtro={filtro}
              onFiltroChange={setFiltro}
            />
          
        </div>
      </div>
    </div>
  );
}

export default CadastrarMembros;
