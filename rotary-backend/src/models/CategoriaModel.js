import pool from "../config/database.js";

class CategoriaModel {
    // Listar todas as categorias
    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM categorias ORDER BY nome"
        );
        return rows;
    }

    // buscar categoria por nome ou id
    static async buscarPorTermo(termo) {
        const query = `
            SELECT * FROM categorias
            WHERE nome LIKE ? OR id = ?
            ORDER BY nome
        `;
        const likeTermo = `%${termo}%`;
        const [rows] = await pool.query(query, [likeTermo, termo]);
        return rows;
    }

    // cadastrar nova categoria
    static async cadastrar(categoria) {
        const { nome, descricao } = categoria;
        const [result] = await pool.query(
            `INSERT INTO categorias (nome, descricao) VALUES (?, ?)`,
            [nome, descricao]
        );
        return { id: result.insertId, ...categoria };
    }

    // atualizar categoria
    static async atualizar(id, categoria) {
        const [result] = await pool.query(
            `UPDATE categorias SET ? WHERE id = ?`,
            [categoria, id]
        );
        if (result.affectedRows === 0) {
            throw new Error("Categoria não encontrada");
        }
        return { id, ...categoria };
    }

    // excluir categoria
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM categorias WHERE id = ?`,
            [id]
        );
        if (result.affectedRows === 0) {
            throw new Error("Categoria não encontrada");
        }
        return { message: "Categoria excluída com sucesso" };
    }

    //atualizar status da categoria
    static async atualizarStatus(id, status) {
        const [result] = await pool.query(
            `UPDATE categorias SET status = ? WHERE id = ?`,
            [status, id]
        );
        if (result.affectedRows === 0) {
            throw new Error("Categoria não encontrada");
        }
        return { id, status };
    }
}

export default CategoriaModel;