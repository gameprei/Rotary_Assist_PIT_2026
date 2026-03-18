import { useState, useEffect } from "react";
import "../shared/App.css";
import FornecedoresService from "../../services/FornecedoresService.js";
import FormFornecedores from "./FormFornecedores.jsx";
import FormTabelaFornecedores from "./FormTabelaFornecedores.jsx";

function CadastrarFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    tipo_pessoa: "",
    nome: "",
    cpf: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    status: ""
  });
  const [filtro, setFiltro] = useState("");
  const [erros, setErros] = useState({});
  const [editando, setEditando] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const carregarFornecedores = async () => {
    setCarregando(true);
    try {
      const dados = await FornecedoresService.listarTodos();
      setFornecedores(dados);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      alert("Erro ao carregar fornecedores.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setCarregando(true);
    try {
      if (editando) {
        await FornecedoresService.atualizar(fornecedorEditando.id, formData);
        alert("Fornecedor atualizado com sucesso!");
      } else {
        await FornecedoresService.cadastrar(formData);
        alert("Fornecedor cadastrado com sucesso!");
      }

      await carregarFornecedores();
      handleCancelar();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const excluirFornecedor = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    
    try {
      await FornecedoresService.excluir(id);
      await carregarFornecedores();
      alert("Fornecedor excluído com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir fornecedor.");
    }
  };

  const editarFornecedor = (f) => {
    setFormData({ ...f });
    setEditando(true);
    setFornecedorEditando(f);
    setErros({});
    window.scrollTo(0, 0);
  };

  const handleInputChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome) novosErros.nome = "Nome obrigatório";
    if (!formData.tipo_pessoa) novosErros.tipo_pessoa = "Tipo obrigatório";
    if (!formData.status) novosErros.status = "Status obrigatório";

    // Validação condicional de CPF/CNPJ
    if (formData.tipo_pessoa === "PF" && !formData.cpf) {
      novosErros.cpf = "CPF obrigatório para pessoa física";
    }
    if (formData.tipo_pessoa === "PJ" && !formData.cnpj) {
      novosErros.cnpj = "CNPJ obrigatório para pessoa jurídica";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCancelar = () => {
    setFormData({
      id: null,
      tipo_pessoa: "",
      nome: "",
      cpf: "",
      cnpj: "",
      telefone: "",
      email: "",
      endereco: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      status: ""
    });
    setEditando(false);
    setFornecedorEditando(null);
    setErros({});
  };

  return (
    <div className="prototype-screen active">
      <div className="screen-frame">
        <div className="screen-header">
          <h3>Cadastro de Fornecedores</h3>
        </div>

        <div className="screen-content">
          {carregando ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : (
            <FormFornecedores
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

      <br />

      <div className="screen-frame">
        <div className="screen-header">
          <h3>Fornecedores Cadastrados</h3>
        </div>

        <FormTabelaFornecedores
          fornecedores={fornecedores}
          onExcluirFornecedor={excluirFornecedor}  
          onEditarFornecedor={editarFornecedor}    
          filtro={filtro}
          onFiltroChange={setFiltro}
        />
      </div>
    </div>
  );
}

export default CadastrarFornecedores;