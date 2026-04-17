import pool from "../config/database.js";

class FornecedorModel {

    // Listar todos os fornecedores
    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM fornecedores ORDER BY nome"
        );
        return rows;
    }

    // Buscar fornecedores por termo
    static async buscarPorTermo(termo) {
        const query = `
            SELECT * FROM fornecedores
            WHERE nome LIKE ? OR cnpj LIKE ? OR cpf LIKE ? OR id = ?
            ORDER BY nome
        `;

        const likeTermo = `%${termo}%`;

        const [rows] = await pool.query(
            query,
            [likeTermo, likeTermo, likeTermo, termo]
        );

        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
            "SELECT * FROM fornecedores WHERE id = ? LIMIT 1",
            [id]
        );

        return rows[0] || null;
    }

    static async existeCpfDuplicado(cpf, idIgnorado = null) {
        if (!cpf) {
            return false;
        }

        if (idIgnorado) {
            const [rows] = await pool.query(
                "SELECT id FROM fornecedores WHERE cpf = ? AND id <> ? LIMIT 1",
                [cpf, idIgnorado]
            );
            return rows.length > 0;
        }

        const [rows] = await pool.query(
            "SELECT id FROM fornecedores WHERE cpf = ? LIMIT 1",
            [cpf]
        );

        return rows.length > 0;
    }

    static async existeCnpjDuplicado(cnpj, idIgnorado = null) {
        if (!cnpj) {
            return false;
        }

        if (idIgnorado) {
            const [rows] = await pool.query(
                "SELECT id FROM fornecedores WHERE cnpj = ? AND id <> ? LIMIT 1",
                [cnpj, idIgnorado]
            );
            return rows.length > 0;
        }

        const [rows] = await pool.query(
            "SELECT id FROM fornecedores WHERE cnpj = ? LIMIT 1",
            [cnpj]
        );

        return rows.length > 0;
    }

    static async fornecedorEmUso(id) {
        const [rows] = await pool.query(
            "SELECT id FROM equipamentos WHERE fornecedor_id = ? LIMIT 1",
            [id]
        );

        return rows.length > 0;
    }

    // Cadastrar novo fornecedor
    static async cadastrar(fornecedor) {
        const {
            tipo_pessoa,
            nome,
            cpf,
            cnpj,
            telefone,
            email,
            endereco,
            bairro,
            cidade,
            uf,
            cep,
            status
        } = fornecedor;

        const [result] = await pool.query(
            `INSERT INTO fornecedores 
            (tipo_pessoa, nome, cpf, cnpj, telefone, email, endereco, bairro, cidade, uf, cep, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tipo_pessoa,
                nome,
                cpf || null,
                cnpj || null,
                telefone,
                email,
                endereco,
                bairro,
                cidade,
                uf,
                cep,
                status
            ]
        );

        return {
            id: result.insertId,
            ...fornecedor,
        };
    }

    // Atualizar fornecedor
    static async atualizar(id, fornecedor) {
        await pool.query(
            `UPDATE fornecedores SET ? WHERE id = ?`,
            [fornecedor, id]
        );

        return await this.buscarPorId(id);
    }

    // Deletar fornecedor
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM fornecedores WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    // filtrar fornecedores por termo
    static async filtrarPorTermo(termo) {
        const termoBusca = `%${termo}%`;

        const query = `
            SELECT * FROM fornecedores
            WHERE nome LIKE ? OR cnpj LIKE ? OR cpf LIKE ?
            ORDER BY nome DESC
        `;

        const [rows] = await pool.query(
            query,
            [termoBusca, termoBusca, termoBusca]
        );

        return rows;
    }
}

export default FornecedorModel;