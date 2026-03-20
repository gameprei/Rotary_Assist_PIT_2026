import { useState, useEffect } from "react";
import "../shared/App.css";
import EmprestimosService from "../../services/EmprestimosService.js";
import EquipamentosService from "../../services/EquipamentosService.js";
import FormRegistrarEmprestimos from "./FormRegistrarEmprestimos.jsx";
import FormTabelaEmprestimos from "./FormTabelaEmprestimos.jsx";

function RegistrarEmprestimos() {
    const [emprestimos, setEmprestimos] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        equipamento_id: "",
        beneficiario_cpf: "",
        membro_cpf: "",
        data_emprestimo: "",
        data_prevista_devolucao: "",
        status: "ATIVO",
        observacoes: "",
        data_registro: ""
    });
    const [filtro, setFiltro] = useState("");
    const [erros, setErros] = useState({});
    const [editando, setEditando] = useState(false);
    const [emprestimoEditando, setEmprestimoEditando] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const carregarEmprestimos = async () => {
        setCarregando(true);
        try {
            const dados = await EmprestimosService.listarTodos();
            setEmprestimos(dados);
        } catch (error) {
            console.error("Erro ao carregar empréstimos:", error);
            alert("Erro ao carregar empréstimos.");
        } finally {
            setCarregando(false);
        }
    };

    const carregarEquipamentos = async () => {
        try {
            const dados = await EquipamentosService.listarTodos();
            setEquipamentos(dados);
        } catch (error) {
            console.error("Erro ao carregar equipamentos:", error);
            alert("Erro ao carregar equipamentos.");
        }
    };

    useEffect(() => {
        carregarEmprestimos();
        carregarEquipamentos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setCarregando(true);
        try {
            if (editando) {
                await EmprestimosService.atualizar(emprestimoEditando.id, formData);
                alert("Empréstimo atualizado com sucesso!");
            } else {
                await EmprestimosService.cadastrar(formData);
                alert("Empréstimo registrado com sucesso!");
            }
            await carregarEmprestimos();
            handleCancelar();
        } catch (error) {
            console.error("Erro ao salvar empréstimo:", error);
            alert(`Erro: ${error.message}`);
        } finally {
            setCarregando(false);
        }
    };

    const handleInputChange = (campo, valor) => {
        setFormData({ ...formData, [campo]: valor });
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (!formData.equipamento_id) novosErros.equipamento_id = "Equipamento é obrigatório";
        if (!formData.beneficiario_cpf) novosErros.beneficiario_cpf = "CPF do beneficiário é obrigatório";
        if (!formData.membro_cpf) novosErros.membro_cpf = "CPF do membro responsável é obrigatório";
        if (!formData.data_emprestimo) novosErros.data_emprestimo = "Data do empréstimo é obrigatória";
        if (!formData.data_prevista_devolucao) novosErros.data_prevista_devolucao = "Data prevista de devolução é obrigatória";
        if (!formData.status) novosErros.status = "Status é obrigatório";

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleCancelar = () => {
        setFormData({
            id: null,
            equipamento_id: "",
            beneficiario_cpf: "",
            membro_cpf: "",
            data_emprestimo: "",
            data_prevista_devolucao: "",
            status: "ATIVO",
            observacoes: "",
            data_registro: ""
        });
        setEditando(false);
        setEmprestimoEditando(null);
        setErros({});
    };

    return (
        <div className="prototype-screen active">
            <div className="screen-frame">
                <div className="screen-header">
                    <h3>Registrar Empréstimos</h3>
                </div>
                <div className="screen-content">
                    {carregando ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                        </div>
                    ) : (
                        <FormRegistrarEmprestimos
                            formData={formData}
                            onFormChange={handleInputChange}
                            onSubmit={handleSubmit}
                            erros={erros}
                            onCancelar={handleCancelar}
                            equipamentos={equipamentos}
                        />
                    )}
                </div>
            </div>

            <br />

            <div className="screen-frame">
                <div className="screen-header">
                    <h3>Empréstimos Registrados</h3>
                </div>
                <FormTabelaEmprestimos
                    emprestimos={emprestimos}
                    filtro={filtro}
                    onFiltroChange={setFiltro}
                    
                />
            </div>
        </div>
    );
}

export default RegistrarEmprestimos;