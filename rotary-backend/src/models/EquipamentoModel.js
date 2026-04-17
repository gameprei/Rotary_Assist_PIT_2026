import pool from "../config/database.js";

class EquipamentoModel {

    // Listar todos os equipamentos
    static async listarTodos() {

        const query = `
            SELECT 
                e.*,
                c.nome AS categoria,
                f.nome AS fornecedor
            FROM equipamentos e
            LEFT JOIN categorias c ON e.categoria_id = c.id
            LEFT JOIN fornecedores f ON e.fornecedor_id = f.id
            ORDER BY e.nome
        `;

        const [rows] = await pool.query(query);
        return rows;
    }

    // buscar equipamento por nome ou patrimonio
    static async buscarPorTermo(termo) {
        const query = `
            SELECT 
                e.*,
                c.nome AS categoria,
                f.nome AS fornecedor
            FROM equipamentos e
            LEFT JOIN categorias c ON e.categoria_id = c.id
            LEFT JOIN fornecedores f ON e.fornecedor_id = f.id
            WHERE e.nome LIKE ? OR e.patrimonio LIKE ? OR e.id = ?
            ORDER BY e.nome
        `;

        const likeTermo = `%${termo}%`;

        const [rows] = await pool.query(query, [likeTermo, likeTermo, termo]);

        return rows;
    }

    static async buscarPorId(id) {
        const query = `
            SELECT 
                e.*,
                c.nome AS categoria,
                f.nome AS fornecedor
            FROM equipamentos e
            LEFT JOIN categorias c ON e.categoria_id = c.id
            LEFT JOIN fornecedores f ON e.fornecedor_id = f.id
            WHERE e.id = ?
            LIMIT 1
        `;

        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    }

    static async existePatrimonioDuplicado(patrimonio, idIgnorado = null) {
        if (idIgnorado) {
            const [rows] = await pool.query(
                `SELECT id FROM equipamentos WHERE patrimonio = ? AND id <> ? LIMIT 1`,
                [patrimonio, idIgnorado]
            );
            return rows.length > 0;
        }

        const [rows] = await pool.query(
            `SELECT id FROM equipamentos WHERE patrimonio = ? LIMIT 1`,
            [patrimonio]
        );

        return rows.length > 0;
    }

    static async existeNumeroSerieDuplicado(numeroSerie, idIgnorado = null) {
        if (idIgnorado) {
            const [rows] = await pool.query(
                `SELECT id FROM equipamentos WHERE numero_serie = ? AND id <> ? LIMIT 1`,
                [numeroSerie, idIgnorado]
            );
            return rows.length > 0;
        }

        const [rows] = await pool.query(
            `SELECT id FROM equipamentos WHERE numero_serie = ? LIMIT 1`,
            [numeroSerie]
        );

        return rows.length > 0;
    }

    static async categoriaAtivaExiste(categoriaId) {
        const [rows] = await pool.query(
            `SELECT id FROM categorias WHERE id = ? AND status = 'ATIVO' LIMIT 1`,
            [categoriaId]
        );

        return rows.length > 0;
    }

    static async fornecedorAtivoExiste(fornecedorId) {
        const [rows] = await pool.query(
            `SELECT id FROM fornecedores WHERE id = ? AND status = 'ATIVO' LIMIT 1`,
            [fornecedorId]
        );

        return rows.length > 0;
    }

    static async equipamentoEmprestado(id) {
        const [rows] = await pool.query(
            `SELECT id FROM equipamentos WHERE id = ? AND status = 'EMPRESTADO' LIMIT 1`,
            [id]
        );

        return rows.length > 0;
    }

    // cadastrar novo equipamento
    static async cadastrar(equipamento) {
        const {
            nome,
            descricao,
            patrimonio,
            numero_serie,
            categoria_id,
            fornecedor_id,
            estado_conservacao,
            data_aquisicao
        } = equipamento;

        const [result] = await pool.query(
            `INSERT INTO equipamentos
            (nome, descricao, patrimonio, numero_serie, categoria_id, fornecedor_id, estado_conservacao, data_aquisicao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                descricao,
                patrimonio,
                numero_serie,
                categoria_id,
                fornecedor_id,
                estado_conservacao,
                data_aquisicao
            ]
        );

        return { id: result.insertId, ...equipamento };
    }

    // atualizar equipamento
    static async atualizar(id, equipamento) {
        await pool.query(
            `UPDATE equipamentos SET ? WHERE id = ?`,
            [equipamento, id]
        );

        return await this.buscarPorId(id);
    }

    // excluir equipamento
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM equipamentos WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    // atualizar status do equipamento
    static async atualizarStatus(id, status) {
        const [result] = await pool.query(
            `UPDATE equipamentos SET status = ? WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return await this.buscarPorId(id);
    }

}

export default EquipamentoModel;