import { useState, useEffect } from "react";
import "../shared/App.css";
import EquipamentosService from "../../services/EquipamentosService.js";
import FornecedoresService from "../../services/FornecedoresService.js";
import CategoriasService from "../../services/CategoriasService.js";
import FormEquipamentos from "./FormEquipamentos.jsx";
import FormTabelaEquipamentos from "./FormTabelaEquipamentos.jsx";

function CadastrarEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nome: "",
    descricao: "",
    patrimonio: "",
    numero_serie: "",           // NOVO
    categoria_id: "",           // NOVO
    fornecedor_id: "",          // NOVO
    estado_conservacao: "",
    status: "",                 // NOVO
    data_aquisicao: "",
  });
  const [filtro, setFiltro] = useState("");
  const [erros, setErros] = useState({});
  const [editando, setEditando] = useState(false);
  const [equipamentoEditando, setEquipamentoEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);

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

  const carregarAuxiliares = async () => {
  try {
    const [cats, forns] = await Promise.all([
      CategoriasService.listarTodos(),
      FornecedoresService.listarTodos()
    ]);

    setCategorias(cats);
    setFornecedores(forns);
  } catch (error) {
    console.error("Erro ao carregar dados auxiliares:", error);
  }
  };

  useEffect(() => {
    carregarEquipamentos();
    carregarAuxiliares();
  }, []);

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

      setFormData({
        id: null,
        nome: "",
        descricao: "",
        patrimonio: "",
        numero_serie: "",
        categoria_id: "",
        fornecedor_id: "",
        estado_conservacao: "",
        status: "",
        data_aquisicao: ""
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

  const excluirEquipamento = async (id) => {
    try {
      await EquipamentosService.excluir(id);
      await carregarEquipamentos();
      alert("Equipamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      alert(`Erro ao excluir equipamento: ${error.message || "Tente novamente."}`);
    }
  };

  const editarEquipamento = (equipamento) => {
    const novosDados = {
      nome: equipamento.nome || "",
      patrimonio: equipamento.patrimonio || "",
      tipo: equipamento.tipo || "",
      numero_serie: equipamento.numero_serie || "",
      categoria_id: equipamento.categoria_id || "",
      fornecedor_id: equipamento.fornecedor_id || "",
      estado_conservacao: equipamento.estado_conservacao || "",
      status: equipamento.status || "",
      data_aquisicao: equipamento.data_aquisicao || "",
      descricao: equipamento.descricao || ""
    };

    setFormData(novosDados);
    setEditando(true);
    setEquipamentoEditando(equipamento);
    setErros({});
    window.scrollTo(0, 0);
  };

  const handleInputChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const validarFormulario = () => {
    const novosErros = {};

    const camposObrigatorios = {
      nome: "Nome do equipamento é obrigatório",
      patrimonio: "Patrimônio é obrigatório",
      tipo: "Tipo é obrigatório",
      categoria_id: "Categoria é obrigatória",      // NOVO
      fornecedor_id: "Fornecedor é obrigatório",    // NOVO
      estado_conservacao: "Estado de conservação é obrigatório",
      status: "Status é obrigatório",               // NOVO
      data_aquisicao: "Data de aquisição é obrigatória",
      descricao: "Descrição é obrigatória"
    };

    Object.entries(camposObrigatorios).forEach(([campo, mensagem]) => {
      if (!formData[campo]) novosErros[campo] = mensagem;
    });

    if (formData.data_aquisicao && !/^\d{4}-\d{2}-\d{2}$/.test(formData.data_aquisicao)) {
      novosErros.data_aquisicao = "Data de aquisição inválida";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCancelar = () => {
    setFormData({
      nome: "",
      patrimonio: "",
      tipo: "",
      numero_serie: "",
      categoria_id: "",
      fornecedor_id: "",
      estado_conservacao: "",
      status: "",
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
              categorias={categorias}
              fornecedores={fornecedores}
            />
          )}
        </div>
      </div>

      <br />

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