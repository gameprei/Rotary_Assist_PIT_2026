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

        // Usamos uma conexão do pool (connection) para garantir que todas as queries
        // desta operação usem a mesma conexão do banco. Isso permite utilizar
        // transações (beginTransaction, commit, rollback) e evita inconsistências,
        // como registrar um empréstimo mas falhar ao atualizar o status do equipamento.
        const connection = await pool.getConnection();

        try {

            const {
                equipamento_id,
                beneficiario_cpf,
                membro_cpf,
                data_emprestimo,
                data_prevista_devolucao
            } = emprestimo;

            await connection.beginTransaction();

            // Verificar se o equipamento existe
            const [equipamento] = await connection.query(
                `SELECT id, status FROM equipamentos WHERE id = ?`,
                [equipamento_id]
            );

            if (equipamento.length === 0) {
                throw new Error("Equipamento não encontrado");
            }

            // Verificar se já existe empréstimo ativo
            const [emprestimoAtivo] = await connection.query(
                `SELECT id
             FROM emprestimos
             WHERE equipamento_id = ?
             AND status = 'ATIVO'`,
                [equipamento_id]
            );

            if (emprestimoAtivo.length > 0) {
                throw new Error("Este equipamento já possui um empréstimo ativo");
            }

            // Verificar disponibilidade
            if (equipamento[0].status !== "DISPONIVEL") {
                throw new Error("Equipamento não está disponível para empréstimo");
            }

            // Verificar beneficiário
            const [beneficiario] = await connection.query(
                `SELECT cpf FROM beneficiarios WHERE cpf = ?`,
                [beneficiario_cpf]
            );

            if (beneficiario.length === 0) {
                throw new Error("Beneficiário não encontrado");
            }

            // Verificar membro responsável
            const [membro] = await connection.query(
                `SELECT cpf FROM membros WHERE cpf = ?`,
                [membro_cpf]
            );

            if (membro.length === 0) {
                throw new Error("Membro responsável não encontrado");
            }

            // Registrar empréstimo
            const [result] = await connection.query(
                `INSERT INTO emprestimos
            (equipamento_id, beneficiario_cpf, membro_cpf, data_emprestimo, data_prevista_devolucao, status)
            VALUES (?, ?, ?, ?, ?, 'ATIVO')`,
                [equipamento_id, beneficiario_cpf, membro_cpf, data_emprestimo, data_prevista_devolucao]
            );

            // Atualizar status do equipamento
            await connection.query(
                `UPDATE equipamentos
             SET status = 'EMPRESTADO'
             WHERE id = ?`,
                [equipamento_id]
            );

            await connection.commit();

            const id = result.insertId;

            return {
                id,
                ...emprestimo,
                status: "ATIVO"
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }
    }
}

export default EmprestimoModel;