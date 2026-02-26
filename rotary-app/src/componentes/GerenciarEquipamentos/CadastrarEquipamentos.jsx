import { useState, useEffect } from "react";
import "../shared/App.css";
import EquipamentosService from "../../services/EquipamentosService.js";
import FormEquipamentos from "./FormEquipamentos.jsx";
import FormTabelaEquipamentos from "./FormTabelaEquipamentos.jsx";

function CadastrarEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    patrimonio: "",
    tipo: "",
    estado_conservacao: "",
    data_aquisicao: "",
    descricao: ""
  });
  const [filtro, setFiltro] = useState("");
  const [erros, setErros] = useState({});
  const [editando, setEditando] = useState(false);
  const [equipamentoEditando, setEquipamentoEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Carregar equipamentos com service
  const carregarEquipamentos = async () => {
    setCarregando(true);
    try {
      const dados = await EquipamentosService.listarTodos();
      setEquipamentos(dados);
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
      alert("Erro ao carregar equipamentos.");
    } finally {
      setCarregando(false);
    }
  };

  // Carregar equipamentos na inicialização
  useEffect(() => {
    carregarEquipamentos();
  }, []);

  // Salvar equipamentos utilizando service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    setCarregando(true);
    try {
      if (editando) {
        await EquipamentosService.atualizar(equipamentoEditando.patrimonio, formData);
        alert("Equipamento atualizado com sucesso!");
      } else {
        await EquipamentosService.cadastrar(formData);
        alert("Equipamento cadastrado com sucesso!");
      }
      await carregarEquipamentos();
      // Limpa o formulário após salvar
      setFormData({
        nome: "",
        patrimonio: "",
        tipo: "",
        estado_conservacao: "",
        data_aquisicao: "",
        descricao: ""
      });
      setEditando(false);
      setEquipamentoEditando(null);
      setErros({});
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      alert(`Erro ao salvar equipamento: ${error.message || "Tente novamente."}`);
    } finally {
      setCarregando(false);
    }
  };

  // Excluir equipamento utilizando service
  const excluirEquipamento = async (patrimonio) => {
    try {
      await EquipamentosService.excluir(patrimonio);
      await carregarEquipamentos();
      alert("Equipamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      alert(`Erro ao excluir equipamento: ${error.message || "Tente novamente."}`);
    }
  };

  // Editar equipamento
  const editarEquipamento = (equipamento) => {
    const novosDados = {
      nome: equipamento.nome || "",
      patrimonio: equipamento.patrimonio || "",
      tipo: equipamento.tipo || "",
      estado_conservacao: equipamento.estado_conservacao || "",
      data_aquisicao: equipamento.data_aquisicao || "",
      descricao: equipamento.descricao || ""
    };

    setFormData(novosDados);
    setEditando(true);
    setEquipamentoEditando(equipamento);
    setErros({});
    
    // Rola a página para o topo para ver o formulário
    window.scrollTo(0, 0);
  };

  // Função genérica para atualizar qualquer campo
  const handleInputChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  // Validação do formulário
  const validarFormulario = () => {
    const novosErros = {};

    // Validar campos obrigatórios
    const camposObrigatorios = {
      nome: "Nome do equipamento é obrigatório",
      patrimonio: "Patrimônio é obrigatório",
      tipo: "Tipo é obrigatório",
      estado_conservacao: "Estado de conservação é obrigatório",
      data_aquisicao: "Data de aquisição é obrigatória",
      descricao: "Descrição é obrigatória"
    };

    Object.entries(camposObrigatorios).forEach(([campo, mensagem]) => {
      if (!formData[campo]) novosErros[campo] = mensagem;
    });

    // Validar formato da data de aquisição
    if (formData.data_aquisicao && !/^\d{4}-\d{2}-\d{2}$/.test(formData.data_aquisicao)) {
      novosErros.data_aquisicao = "Data de aquisição inválida";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para limpar formulário
  const handleCancelar = () => {
    setFormData({
      nome: "",
      patrimonio: "",
      tipo: "",
      estado_conservacao: "",
      data_aquisicao: "",
      descricao: ""
    });
    setEditando(false);
    setEquipamentoEditando(null);
    setErros({});
  };

  return (
    <div id="equipamentos-rotary" className="prototype-screen active">
      <div className="screen-frame">
        <div className="screen-header">
          <h3>Cadastro de Equipamentos Rotary</h3>
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
            <FormEquipamentos
              formData={formData}
              onFormChange={handleInputChange}
              onSubmit={handleSubmit}
              erros={erros}
              editando={editando}
              onCancelar={handleCancelar}
            />
          )}
        </div>
      </div>
      <br></br>
      <div className="prototype-screen active">
        <div className="screen-frame">
          <div className="screen-header">
            <h3>Equipamentos Cadastrados</h3>
          </div>

          <FormTabelaEquipamentos
            equipamentos={equipamentos}
            onExcluirEquipamento={excluirEquipamento}
            onEditarEquipamento={editarEquipamento}
            filtro={filtro}
            onFiltroChange={setFiltro}
          />
        </div>
      </div>
    </div>
  );
}

export default CadastrarEquipamentos;