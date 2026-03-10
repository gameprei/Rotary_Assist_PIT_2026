import pool from "../config/database.js";

class FornecedorModel {
    // Listar todos os fornecedores
    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM fornecedores ORDER BY nome"
        );
        return rows;
    }

    // Buscar fornecedores por cnpj || nome || cpf || id
    static async buscarPorTermo(termo) {
        const query = `
            SELECT * FROM fornecedores
            WHERE nome LIKE ? OR cnpj LIKE ? OR cpf LIKE ? OR id = ?
            ORDER BY nome
        `;
        const likeTermo = `%${termo}%`;
        const [rows] = await pool.query(query, [likeTermo, likeTermo, likeTermo, termo]);
        return rows;
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
            ]
        );
        return {
            id: result.insertId, ...fornecedor
        };

    }

    // Atualizar fornecedor
    static async atualizar(id, fornecedor) {
        if (!fornecedor || Object.keys(fornecedor).length === 0) {
            throw new Error("Nenhum campo para atualizar");
        }
        const [result] = await pool.query(
            `UPDATE fornecedores SET ? WHERE id = ?`,
            [fornecedor, id]
        );
        if (result.affectedRows === 0) {
            throw new Error("Fornecedor não encontrado");
        }
        return { id, ...fornecedor };
    }

    // Deletar fornecedor
    static async excluir(id) {
        const [result] = await pool.query(
            `DELETE FROM fornecedores WHERE id = ?`,
            [id]
        );
        if (result.affectedRows === 0) {
            throw new Error("Fornecedor não encontrado");
        }
        return { message: "Fornecedor excluído com sucesso" };
    }

    // filtrar fornecedores por termo
    static async filtrarPorTermo(termo) {
        const termoBusca = `%${termo}%`;
        const query = `
            SELECT * FROM fornecedores
            WHERE nome LIKE ? OR cnpj LIKE ? OR cpf LIKE ?
            ORDER BY nome DESC
        `;
        const [rows] = await pool.query(query, [termoBusca, termoBusca, termoBusca]);
        return rows;
    }
}

export default FornecedorModel;