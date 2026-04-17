import pool from "../config/database.js";

class CategoriaModel {

    // Listar todas as categorias
    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM categorias ORDER BY nome"
        );
        return rows;
    }

    // Buscar categoria por nome ou id
    static async buscarPorTermo(termo) {
        const query = `
            SELECT * FROM categorias
            WHERE nome LIKE ? OR id = ?
            ORDER BY nome
        `;

        const likeTermo = `%${termo}%`;
        const id = Number(termo) || 0;

        const [rows] = await pool.query(query, [likeTermo, id]);

        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
            "SELECT * FROM categorias WHERE id = ? LIMIT 1",
            [id]
        );

        return rows[0] || null;
    }

    static async buscarPorNome(nome) {
        const [rows] = await pool.query(
            "SELECT id, nome FROM categorias WHERE nome = ? LIMIT 1",
            [nome]
        );

        return rows[0] || null;
    }

    static async categoriaEmUso(id) {
        const [rows] = await pool.query(
            "SELECT id FROM equipamentos WHERE categoria_id = ? LIMIT 1",
            [id]
        );

        return rows.length > 0;
    }

    // Cadastrar nova categoria
    static async cadastrar(categoria) {
        const { nome, tipo, descricao, status } = categoria;

        const [result] = await pool.query(
            `INSERT INTO categorias (nome, tipo, descricao, status) VALUES (?, ?, ?, ?)`,
            [nome, tipo, descricao, status]
        );

        return {
            id: result.insertId,
            nome,
            tipo,
            descricao,
            status,
        };
    }

    // Atualizar categoria
    static async atualizar(id, categoria) {
        await pool.query(
            `UPDATE categorias SET ? WHERE id = ?`,
            [categoria, id]
        );

        return await this.buscarPorId(id);
    }

    // Excluir categoria
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM categorias WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }

    // Atualizar status da categoria
    static async atualizarStatus(id, status) {
        const [result] = await pool.query(
            `UPDATE categorias SET status = ? WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return await this.buscarPorId(id);
    }
}

export default CategoriaModel;