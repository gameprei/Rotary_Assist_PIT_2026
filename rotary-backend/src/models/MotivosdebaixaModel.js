import pool from "../config/database.js";

class MotivosdebaixaModel {
    // Listar todas as baixas de equipamentos
    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM motivos_baixa ORDER BY nome"
        );
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
            "SELECT * FROM motivos_baixa WHERE id = ? LIMIT 1",
            [id]
        );

        return rows[0] || null;
    }

    static async buscarPorNome(nome) {
        const [rows] = await pool.query(
            "SELECT id, nome, status FROM motivos_baixa WHERE nome = ? LIMIT 1",
            [nome]
        );

        return rows[0] || null;
    }

    static async motivoEmUso(id) {
        const [rows] = await pool.query(
            "SELECT id FROM baixas_equipamento WHERE motivo_id = ? LIMIT 1",
            [id]
        );

        return rows.length > 0;
    }

    static async cadastrar(motivo) {
        const { nome, status } = motivo;

        const [result] = await pool.query(
            "INSERT INTO motivos_baixa (nome, status) VALUES (?, ?)",
            [nome, status]
        );

        return {
            id: result.insertId,
            nome,
            status,
        };
    }

    // Excluir motivo de baixa
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM motivos_baixa WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }
}

export default MotivosdebaixaModel;