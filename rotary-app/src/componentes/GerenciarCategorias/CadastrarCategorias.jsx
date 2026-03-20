import { useState, useEffect } from "react";
import "../shared/App.css";
import CategoriasService from "../../services/CategoriasService.js";
import FormCategorias from "./FormCategorias.jsx";
import FormTabelaCategorias from "./FormTabelaCategorias.jsx";

function CadastrarCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        nome: "",
        tipo: "",
        descricao: "",
        status: ""
    });
    const [filtro, setFiltro] = useState("");
    const [erros, setErros] = useState({});
    const [editando, setEditando] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const carregarCategorias = async () => {
        setCarregando(true);
        try {
            const dados = await CategoriasService.listarTodos();
            setCategorias(dados);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            alert("Erro ao carregar categorias.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setCarregando(true);
        try {
            if (editando) {
                await CategoriasService.atualizar(categoriaEditando.id, formData);
                alert("Categoria atualizada com sucesso!");
            } else {
                await CategoriasService.cadastrar(formData);
                alert("Categoria cadastrada com sucesso!");
            }
            carregarCategorias();
            setFormData({
                id: null,
                nome: "",
                tipo: "",
                descricao: "",
                status: ""
            });
            setEditando(false);
            setCategoriaEditando(null);
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            alert("Erro ao salvar categoria.");
        } finally {
            setCarregando(false);
        }
    };

    const excluirCategoria = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
        try {
            await CategoriasService.excluir(id);
            carregarCategorias();
            alert("Categoria excluída com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir categoria.");
        }
    };

    const editarCategoria = (c) => {
        setFormData({ ...c });
        setEditando(true);
        setCategoriaEditando(c);
    };

    const handleInputChange = (campo, valor) => {
        setFormData((prev) => ({ ...prev, [campo]: valor }));
    };

    const validarFormulario = () => {
        const novosErros = {};
        if (!formData.nome) novosErros.nome = "Nome é obrigatório";
        if (!formData.tipo) novosErros.tipo = "Tipo é obrigatório";
        if (!formData.status) novosErros.status = "Status é obrigatório";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleCancelar = () => {
        setFormData({
            id: null,
            nome: "",
            tipo: "",
            descricao: "",
            status: ""
        });
        setEditando(false);
        setCategoriaEditando(null);
        setErros({});
    };

    return (
        <div className="prototype-screen active">
      <div className="screen-frame">
        <div className="screen-header">
                    <h3>Gerenciar Categorias</h3>
                </div>
                <div className="screen-content">
                    {carregando ? (<div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>) : (

                        <FormCategorias
                            formData={formData}
                            onFormChange={handleInputChange}
                            onSubmit={handleSubmit}
                            onCancelar={handleCancelar}
                            erros={erros}
                            editando={editando}
                        />
                    )}
                </div>
            </div>
            <br />
            <div className="screen-frame">
                <div className="screen-header">
                    <h3>Lista de Categorias</h3>
                </div>
                <FormTabelaCategorias
                    categorias={categorias}
                    onExcluirCategoria={excluirCategoria}
                    onEditarCategoria={editarCategoria}
                    filtro={filtro}
                    onFiltroChange={setFiltro}
                />
            </div>
        </div>
    );
}

export default CadastrarCategorias;
