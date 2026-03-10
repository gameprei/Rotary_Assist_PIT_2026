import pool from "../config/database.js";

class EmprestimoModel {

    // Listar todos os empréstimos => somente para testes, depois ficará na função de saída
    static async listarTodos() {
        const [rows] = await pool.query(`
            SELECT
            e.*,
            eq.nome AS equipamento,
            eq.patrimonio,
            b.nome AS beneficiario,
            m.nome AS responsavel
            FROM emprestimos e
            JOIN equipamentos eq ON e.equipamento_id = eq.id
            JOIN beneficiarios b ON e.beneficiario_cpf = b.cpf
            LEFT JOIN membros m ON e.membro_cpf = m.cpf
            ORDER BY e.data_emprestimo DESC;
        `);
        return rows;
    }

    // Registrar novo empréstimo
    static async registrar(emprestimo) {

        const {
            equipamento_id,
            beneficiario_cpf,
            membro_cpf,
            data_emprestimo,
            data_prevista_devolucao
        } = emprestimo;

        const [result] = await pool.query(
            `INSERT INTO emprestimos
            (equipamento_id, beneficiario_cpf, membro_cpf, data_emprestimo, data_prevista_devolucao, status)
            VALUES (?, ?, ?, ?, ?, 'ATIVO')`,
            [equipamento_id, beneficiario_cpf, membro_cpf, data_emprestimo, data_prevista_devolucao]
        );

        const id = result.insertId;

         // Atualizar status do equipamento para "emprestado"
         await pool.query(
            `UPDATE equipamentos SET status = 'EMPRESTADO' WHERE id = ?`,
            [equipamento_id]
        );
    }
}

export default EmprestimoModel;