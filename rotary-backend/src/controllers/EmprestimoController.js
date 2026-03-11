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

        const {
            equipamento_id,
            beneficiario_cpf,
            membro_cpf,
            data_emprestimo,
            data_prevista_devolucao
        } = req.body;

        if (!equipamento_id || !beneficiario_cpf || !data_emprestimo || !data_prevista_devolucao) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes" });
        }

        if (new Date(data_prevista_devolucao) <= new Date(data_emprestimo)) {
            return res.status(400).json({ error: "Data prevista de devolução deve ser posterior à data de empréstimo" });
        }

        const novoEmprestimo = await EmprestimoModel.registrar({
            equipamento_id,
            beneficiario_cpf,
            membro_cpf,
            data_emprestimo,
            data_prevista_devolucao
        });

        return res.status(201).json(novoEmprestimo);

    } catch (error) {

        console.error("Erro ao registrar empréstimo:", error);

        if (
            error.message === "Equipamento não encontrado" ||
            error.message === "Equipamento não está disponível para empréstimo" ||
            error.message === "Este equipamento já possui um empréstimo ativo" ||
            error.message === "Beneficiário não encontrado" ||
            error.message === "Membro responsável não encontrado"
        ) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({
            error: "Erro interno ao registrar empréstimo"
        });
    }
}
}

export default EmprestimoController;