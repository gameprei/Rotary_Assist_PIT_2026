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

        if (!termo) {
            throw new Error("Termo de busca é obrigatório");
        }

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

        if (!equipamento) {
            throw new Error("Dados do equipamento são obrigatórios");
        }

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

        // Validação de campos obrigatórios
        if (!nome || !patrimonio || !categoria_id || !estado_conservacao || !data_aquisicao) {
            throw new Error("Campos obrigatórios ausentes");
        }

        // Validação de data
        const data = new Date(data_aquisicao);
        if (isNaN(data.getTime())) {
            throw new Error("Data de aquisição inválida");
        }

        // Verificar patrimônio duplicado
        const [patrimonioExistente] = await pool.query(
            `SELECT id FROM equipamentos WHERE patrimonio = ?`,
            [patrimonio]
        );

        if (patrimonioExistente.length > 0) {
            throw new Error("Já existe um equipamento cadastrado com este patrimônio");
        }

        // Número de série duplicado
        if (numero_serie) {
            const [serieExistente] = await pool.query(
                `SELECT id FROM equipamentos WHERE numero_serie = ?`,
                [numero_serie]
            );

            if (serieExistente.length > 0) {
                throw new Error("Número de série já cadastrado");
            }
        }

        // Categoria válida
        const [categoria] = await pool.query(
            `SELECT id FROM categorias WHERE id = ? AND status = 'ATIVO'`,
            [categoria_id]
        );

        if (categoria.length === 0) {
            throw new Error("Categoria não encontrada ou inativa");
        }

        // Fornecedor válido (opcional)
        if (fornecedor_id) {
            const [fornecedor] = await pool.query(
                `SELECT id FROM fornecedores WHERE id = ? AND status = 'ATIVO'`,
                [fornecedor_id]
            );

            if (fornecedor.length === 0) {
                throw new Error("Fornecedor não encontrado ou inativo");
            }
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
                fornecedor_id || null,
                estado_conservacao,
                data_aquisicao
            ]
        );

        return { id: result.insertId, ...equipamento };
    }

    // atualizar equipamento
    static async atualizar(id, equipamento) {

        if (!id) {
            throw new Error("ID do equipamento é obrigatório");
        }

        if (!equipamento || Object.keys(equipamento).length === 0) {
            throw new Error("Dados para atualização são obrigatórios");
        }

        const {
            patrimonio,
            numero_serie,
            categoria_id,
            fornecedor_id,
            data_aquisicao
        } = equipamento;

        // Verificar existência
        const [equipamentoExistente] = await pool.query(
            `SELECT id FROM equipamentos WHERE id = ?`,
            [id]
        );

        if (equipamentoExistente.length === 0) {
            throw new Error("Equipamento não encontrado");
        }

        // Validar patrimônio duplicado
        if (patrimonio) {
            const [patrimonioExistente] = await pool.query(
                `SELECT id FROM equipamentos WHERE patrimonio = ? AND id != ?`,
                [patrimonio, id]
            );

            if (patrimonioExistente.length > 0) {
                throw new Error("Já existe um equipamento cadastrado com este patrimônio");
            }
        }

        // Validar número de série
        if (numero_serie) {
            const [serieExistente] = await pool.query(
                `SELECT id FROM equipamentos WHERE numero_serie = ? AND id != ?`,
                [numero_serie, id]
            );

            if (serieExistente.length > 0) {
                throw new Error("Número de série já cadastrado");
            }
        }

        // Validar categoria
        if (categoria_id) {
            const [categoria] = await pool.query(
                `SELECT id FROM categorias WHERE id = ? AND status = 'ATIVO'`,
                [categoria_id]
            );

            if (categoria.length === 0) {
                throw new Error("Categoria não encontrada ou inativa");
            }
        }

        // Validar fornecedor
        if (fornecedor_id) {
            const [fornecedor] = await pool.query(
                `SELECT id FROM fornecedores WHERE id = ? AND status = 'ATIVO'`,
                [fornecedor_id]
            );

            if (fornecedor.length === 0) {
                throw new Error("Fornecedor não encontrado ou inativo");
            }
        }

        // Validar data
        if (data_aquisicao) {
            const data = new Date(data_aquisicao);
            if (isNaN(data.getTime())) {
                throw new Error("Data de aquisição inválida");
            }
        }

        const [result] = await pool.query(
            `UPDATE equipamentos SET ? WHERE id = ?`,
            [equipamento, id]
        );

        return { id, ...equipamento };
    }

    // excluir equipamento
    static async excluir(id) {

        if (!id) {
            throw new Error("ID do equipamento é obrigatório");
        }

        const [result] = await pool.query(
            `DELETE FROM equipamentos WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Equipamento não encontrado");
        }

        return { message: "Equipamento excluído com sucesso" };
    }

    // atualizar status do equipamento
    static async atualizarStatus(id, status) {

        if (!id || !status) {
            throw new Error("ID e status são obrigatórios");
        }

        const statusPermitidos = ["DISPONIVEL", "EMPRESTADO", "MANUTENCAO", "BAIXADO"];

        if (!statusPermitidos.includes(status)) {
            throw new Error("Status inválido");
        }

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