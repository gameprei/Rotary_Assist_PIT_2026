import pool from "../config/database.js";

class MotivosdebaixaModel {
    // Listar todas as baixas de equipamentos
    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM motivos_baixa ORDER BY id ASC"
        );
        return rows;
    }

    static async cadastrar(motivo) {
        const{
            nome,
        } = motivo;

        // Verificar se já existe motivo de baixa com mesmo nome
        const [nomeExistente] = await pool.query(
            `SELECT id FROM motivos_baixa WHERE nome = ?`,
            [nome]
        );
        if (nomeExistente.length > 0) {
            throw new Error("Já existe motivo de baixa com este nome");
        }

        const [result] = await pool.query(
            `INSERT INTO motivos_baixa (nome) VALUES (?)`,
            [nome]
        );
        return { id: result.insertId, ...motivo };
    }

    // excluir motivo de baixa
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM motivos_baixa WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

}

export default MotivosdebaixaModel;