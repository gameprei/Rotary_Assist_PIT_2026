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

        // Verificar se já existe equipamento com mesmo patrimônio
        const [patrimonioExistente] = await pool.query(
            `SELECT id FROM equipamentos WHERE patrimonio = ?`,
            [patrimonio]
        );
        if (patrimonioExistente.length > 0) {
            throw new Error("Já existe um equipamento cadastrado com este patrimônio");
        }

        // Verificar se já existe equipamento com mesmo número de série (se fornecido)
        if (numero_serie) {
            const [serieExistente] = await pool.query(
                "SELECT id FROM equipamentos WHERE numero_serie = ?",
                [numero_serie]
            );

            if (serieExistente.length > 0) {
                throw new Error("Número de série já cadastrado");
            }
        }

        //categoria deve existir e estar ativa 
        const [categoria] = await pool.query(
            "SELECT id FROM categorias WHERE id = ? AND status = 'ATIVO'",
            [categoria_id]
        );

        if (categoria.length === 0) {
            throw new Error("Categoria não encontrada ou inativa");
        }

        //fornecedor deve existir e estar ativo
        const [fornecedor] = await pool.query(
            "SELECT id FROM fornecedores WHERE id = ? AND status = 'ATIVO'",
            [fornecedor_id]
        );

        if (fornecedor.length === 0) {
            throw new Error("Fornecedor não encontrado ou inativo");
        }
        
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

        const [result] = await pool.query(
            `UPDATE equipamentos SET ? WHERE id = ?`,
            [equipamento, id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Equipamento não encontrado");
        }

        return { id, ...equipamento };
    }

    // excluir equipamento
    static async excluir(id) {

        const [result] = await pool.query(
            `DELETE FROM equipamentos WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return;
        }

        return result;
    }

    //atualizar status do equipamento
    static async atualizarStatus(id, status) {

        const [result] = await pool.query(
            `UPDATE equipamentos SET status = ? WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Equipamento não encontrado");
        }

        return { id, status };
    }

}

export default EquipamentoModel;