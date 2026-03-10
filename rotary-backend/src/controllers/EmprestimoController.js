import { stat } from "node:fs";
import EmprestimoModel from "../models/EmprestimoModel.js";

class EmprestimoController {

    // Listar todos os empréstimos
    static async listarTodos(req, res) {
        try {
            const emprestimos = await EmprestimoModel.listarTodos();
            res.json(emprestimos);
        } catch (error) {
            console.error("Erro ao listar empréstimos:", error);
            res.status(500).json({ error: "Erro ao listar empréstimos" });
        }
    }

    // Registrar novo empréstimo
    static async registrar(req, res) {
        try {
            const{
                equipamento_id,
                beneficiario_cpf,
                membro_cpf,
                data_emprestimo,
                data_prevista_devolucao
            } = req.body;

            if (!equipamento_id || !beneficiario_cpf || !data_emprestimo || !data_prevista_devolucao) {
                return res.status(400).json({ error: "Campos obrigatórios ausentes" });
            }

            const novoEmprestimo = await EmprestimoModel.registrar({
                equipamento_id,
                beneficiario_cpf,
                membro_cpf,
                data_emprestimo,
                data_prevista_devolucao
            });
            res.status(201).json(novoEmprestimo);
        } catch (error) {
            console.error("Erro ao registrar empréstimo:", error);
            res.status(500).json({ error: "Erro ao registrar empréstimo" });
        }
    }
}

export default EmprestimoController;