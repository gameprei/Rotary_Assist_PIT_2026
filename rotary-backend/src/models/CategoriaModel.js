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

        if (!termo) {
            throw new Error("Termo de busca não informado");
        }

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

    // Cadastrar nova categoria
    static async cadastrar(categoria) {

        if (!categoria || Object.keys(categoria).length === 0) {
            throw new Error("Dados da categoria não informados");
        }

        const { nome, tipo, descricao } = categoria;

        if (!nome || !tipo) {
            throw new Error("Campos obrigatórios ausentes");
        }

        // Verificar duplicidade de nome
        const [nomeExistente] = await pool.query(
            `SELECT id FROM categorias WHERE nome = ?`,
            [nome]
        );

        if (nomeExistente.length > 0) {
            throw new Error("Já existe categoria com este nome");
        }

        const [result] = await pool.query(
            `INSERT INTO categorias (nome, tipo, descricao) VALUES (?, ?, ?)`,
            [nome, tipo, descricao]
        );

        return { id: result.insertId, ...categoria };
    }

    // Atualizar categoria
    static async atualizar(id, categoria) {

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw new Error("ID inválido");
        }

        if (!categoria || Object.keys(categoria).length === 0) {
            throw new Error("Nenhum campo informado para atualização");
        }

        const { nome } = categoria;

        // Verificar se categoria existe
        const [categoriaExistente] = await pool.query(
            `SELECT id FROM categorias WHERE id = ?`,
            [id]
        );

        if (categoriaExistente.length === 0) {
            throw new Error("Categoria não encontrada");
        }

        // Validar duplicidade de nome (se vier no update)
        if (nome) {
            const [nomeExistente] = await pool.query(
                `SELECT id FROM categorias WHERE nome = ? AND id != ?`,
                [nome, id]
            );

            if (nomeExistente.length > 0) {
                throw new Error("Já existe categoria com este nome");
            }
        }

        await pool.query(
            `UPDATE categorias SET ? WHERE id = ?`,
            [categoria, id]
        );

        return { id, ...categoria };
    }

    // Excluir categoria
    static async excluir(id) {

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw new Error("ID inválido");
        }

        // Verificar se existe
        const [categoria] = await pool.query(
            `SELECT id FROM categorias WHERE id = ?`,
            [id]
        );

        if (categoria.length === 0) {
            throw new Error("Categoria não encontrada");
        }

        // Verificar se está sendo usada (equipamentos)
        const [uso] = await pool.query(
            `SELECT id FROM equipamentos WHERE categoria_id = ? LIMIT 1`,
            [id]
        );

        if (uso.length > 0) {
            throw new Error("Categoria não pode ser excluída pois está em uso");
        }

        await pool.query(
            `DELETE FROM categorias WHERE id = ?`,
            [id]
        );

        return { message: "Categoria excluída com sucesso" };
    }

    // Atualizar status da categoria
    static async atualizarStatus(id, status) {

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw new Error("ID inválido");
        }

        const statusValidos = ["ATIVO", "INATIVO"];

        if (!statusValidos.includes(status)) {
            throw new Error("Status inválido");
        }

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