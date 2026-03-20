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

        if (!termo) {
            throw new Error("Termo de busca é obrigatório");
        }

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

    // Cadastrar novo fornecedor
    static async cadastrar(fornecedor) {

        if (!fornecedor) {
            throw new Error("Dados do fornecedor são obrigatórios");
        }

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

        // Campos obrigatórios
        if (!tipo_pessoa || !nome) {
            throw new Error("Campos obrigatórios ausentes");
        }

        // Validação tipo pessoa
        if (!["PF", "PJ"].includes(tipo_pessoa)) {
            throw new Error("Tipo de pessoa inválido");
        }

        // Regra CPF/CNPJ
        if (tipo_pessoa === "PF" && !cpf) {
            throw new Error("CPF é obrigatório para pessoa física");
        }

        if (tipo_pessoa === "PJ" && !cnpj) {
            throw new Error("CNPJ é obrigatório para pessoa jurídica");
        }

        // CPF duplicado
        if (cpf) {
            const [cpfExistente] = await pool.query(
                `SELECT id FROM fornecedores WHERE cpf = ?`,
                [cpf]
            );

            if (cpfExistente.length > 0) {
                throw new Error("Já existe fornecedor com este CPF");
            }
        }

        // CNPJ duplicado
        if (cnpj) {
            const [cnpjExistente] = await pool.query(
                `SELECT id FROM fornecedores WHERE cnpj = ?`,
                [cnpj]
            );

            if (cnpjExistente.length > 0) {
                throw new Error("Já existe fornecedor com este CNPJ");
            }
        }

        // Validação simples de email
        if (email && !email.includes("@")) {
            throw new Error("Email inválido");
        }

        // UF (2 letras)
        if (uf && uf.length !== 2) {
            throw new Error("UF inválida");
        }

        const statusFinal = status || "ATIVO";

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
                statusFinal
            ]
        );

        return {
            id: result.insertId,
            ...fornecedor,
            status: statusFinal
        };
    }

    // Atualizar fornecedor
    static async atualizar(id, fornecedor) {

        if (!id) {
            throw new Error("ID do fornecedor é obrigatório");
        }

        if (!fornecedor || Object.keys(fornecedor).length === 0) {
            throw new Error("Nenhum campo para atualizar");
        }

        const {
            cpf,
            cnpj,
            tipo_pessoa,
            email,
            uf
        } = fornecedor;

        // Verificar existência
        const [fornecedorExistente] = await pool.query(
            `SELECT id FROM fornecedores WHERE id = ?`,
            [id]
        );

        if (fornecedorExistente.length === 0) {
            throw new Error("Fornecedor não encontrado");
        }

        // Tipo pessoa
        if (tipo_pessoa && !["PF", "PJ"].includes(tipo_pessoa)) {
            throw new Error("Tipo de pessoa inválido");
        }

        // CPF duplicado
        if (cpf) {
            const [cpfExistente] = await pool.query(
                `SELECT id FROM fornecedores WHERE cpf = ? AND id != ?`,
                [cpf, id]
            );

            if (cpfExistente.length > 0) {
                throw new Error("Já existe fornecedor com este CPF");
            }
        }

        // CNPJ duplicado
        if (cnpj) {
            const [cnpjExistente] = await pool.query(
                `SELECT id FROM fornecedores WHERE cnpj = ? AND id != ?`,
                [cnpj, id]
            );

            if (cnpjExistente.length > 0) {
                throw new Error("Já existe fornecedor com este CNPJ");
            }
        }

        // Email
        if (email && !email.includes("@")) {
            throw new Error("Email inválido");
        }

        // UF
        if (uf && uf.length !== 2) {
            throw new Error("UF inválida");
        }

        const [result] = await pool.query(
            `UPDATE fornecedores SET ? WHERE id = ?`,
            [fornecedor, id]
        );

        return { id, ...fornecedor };
    }

    // Deletar fornecedor
    static async excluir(id) {

        if (!id) {
            throw new Error("ID do fornecedor é obrigatório");
        }

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

        if (!termo) {
            throw new Error("Termo de busca é obrigatório");
        }

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