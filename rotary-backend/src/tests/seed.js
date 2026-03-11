import pool from "../config/database.js";

export async function seedDatabase() {

    // Limpa tabelas respeitando dependências
    await pool.query("DELETE FROM emprestimos");
    await pool.query("DELETE FROM equipamentos");
    await pool.query("DELETE FROM beneficiarios");
    await pool.query("DELETE FROM membros");
    await pool.query("DELETE FROM fornecedores");
    await pool.query("DELETE FROM categorias");

    // -------------------------
    // CATEGORIAS
    // -------------------------
    await pool.query(`
        INSERT INTO categorias (id, nome)
        VALUES
        (1, 'Cadeira de rodas'),
        (2, 'Cadeira de banho'),
        (3, 'Muleta'),
        (4, 'Andador'),
        (5, 'Cama hospitalar')
    `);

    // -------------------------
    // FORNECEDORES
    // -------------------------
    await pool.query(`
        INSERT INTO fornecedores 
        (id, tipo_pessoa, nome, cnpj, telefone, cidade, uf, status)
        VALUES
        (1, 'PJ', 'Ortopedia Técnica Nacional', '11.111.111/0001-11', '11999999999', 'São Paulo', 'SP', 'ATIVO'),
        (2, 'PJ', 'Cadeiras Moderna', '22.222.222/0001-22', '11988888888', 'São Paulo', 'SP', 'ATIVO')
    `);

    // -------------------------
    // BENEFICIARIOS
    // -------------------------
    await pool.query(`
        INSERT INTO beneficiarios
        (nome, cpf, rg, data_nascimento, telefone, endereco, bairro, cidade, uf, cep)
        VALUES
        (
            'João da Silva',
            '12345678901',
            '123456789',
            '1990-05-10',
            '11999999999',
            'Rua A 123',
            'Centro',
            'São Paulo',
            'SP',
            '01000000'
        )
    `);

    // -------------------------
    // MEMBROS
    // -------------------------
    await pool.query(`
        INSERT INTO membros
        (nome, cpf, rg, email, telefone, data_nascimento, data_ingresso, cidade, uf)
        VALUES
        (
            'Maria Oliveira',
            '98765432100',
            '987654321',
            'maria@email.com',
            '11988888888',
            '1985-03-20',
            '2022-01-01',
            'São Paulo',
            'SP'
        )
    `);

    // -------------------------
    // EQUIPAMENTOS
    // -------------------------
    await pool.query(`
        INSERT INTO equipamentos
        (id, nome, descricao, patrimonio, numero_serie, categoria_id, fornecedor_id, estado_conservacao, status)
        VALUES
        (
            1,
            'Cadeira de rodas alumínio',
            'Cadeira leve e dobrável',
            'PAT001',
            'SER001',
            1,
            1,
            'NOVO',
            'DISPONIVEL'
        ),
        (
            2,
            'Muleta ajustável',
            'Muleta de alumínio',
            'PAT002',
            'SER002',
            3,
            2,
            'BOM',
            'DISPONIVEL'
        ),
        (
            3,
            'Andador articulado',
            'Andador dobrável',
            'PAT003',
            'SER003',
            4,
            1,
            'BOM',
            'DISPONIVEL'
        )
    `);

}