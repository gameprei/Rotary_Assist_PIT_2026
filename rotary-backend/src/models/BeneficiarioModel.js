import pool from "../config/database.js";

class BeneficiarioModel {
  
  // Listar todos os beneficiários
  static async listarTodos() {
    const [rows] = await pool.query(
      "SELECT * FROM beneficiarios ORDER BY nome"
    );
    return rows;
  }

  // Buscar beneficiários por cpf || nome || rg
  static async buscarPorTermo(termo) {
    const query = `
      SELECT * FROM beneficiarios
      WHERE nome LIKE ? OR cpf LIKE ? OR rg LIKE ?
      ORDER BY nome
    `;
    const likeTermo = `%${termo}%`;
    const [rows] = await pool.query(query, [likeTermo, likeTermo, likeTermo]);
    return rows;
  }

  static async buscarPorCpf(cpf) {
    const [rows] = await pool.query(
      "SELECT * FROM beneficiarios WHERE cpf = ? LIMIT 1",
      [cpf]
    );

    return rows[0] || null;
  }

  static async validarCpfDuplicado(cpf, cpfIgnorado = null) {
    if (cpfIgnorado) {
      const [rows] = await pool.query(
        "SELECT cpf FROM beneficiarios WHERE cpf = ? AND cpf <> ? LIMIT 1",
        [cpf, cpfIgnorado]
      );
      return rows.length > 0;
    }

    const [rows] = await pool.query(
      "SELECT cpf FROM beneficiarios WHERE cpf = ? LIMIT 1",
      [cpf]
    );

    return rows.length > 0;
  }

  // Cadastrar novo beneficiário
  static async cadastrar(beneficiario) {
    const {
      nome,
      cpf,
      rg,
      data_nascimento,
      telefone,
      email,
      endereco,
      bairro,
      cidade,
      uf,
      cep,
      contato_emergencia,
      telefone_emergencia,
      necessidade_especifica,
    } = beneficiario;

    const [result] = await pool.query(
      `INSERT INTO beneficiarios 
        (nome, cpf, rg, data_nascimento, telefone, email, endereco, bairro, cidade, uf, cep, 
         contato_emergencia, telefone_emergencia, necessidade_especifica) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        cpf,
        rg,
        data_nascimento,
        telefone,
        email,
        endereco,
        bairro,
        cidade,
        uf,
        cep,
        contato_emergencia,
        telefone_emergencia,
        necessidade_especifica,
      ]
    );

    return {
      id: result.insertId,
      nome,
      cpf,
    };
  }

  // Atualizar beneficiário
  static async atualizar(cpfAntigo, beneficiario) {
    if (!beneficiario || Object.keys(beneficiario).length === 0) {
      throw new Error("Nenhum dado fornecido para atualização");
    }

    const [result] = await pool.query(
      `UPDATE beneficiarios SET ? WHERE cpf = ?`,
      [beneficiario, cpfAntigo]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    const cpfAtual = beneficiario.cpf || cpfAntigo;
    return await this.buscarPorCpf(cpfAtual);
  }

  // Deletar beneficiário
  static async excluir(cpf) {
    const [result] = await pool.query(
      `DELETE FROM beneficiarios WHERE cpf = ?`,
      [cpf]
    );
    return result.affectedRows > 0;
  }

  // Filtrar beneficiários por termo nome || cpf || rg || telefone
  static async filtrarPorTermo(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM beneficiarios 
       WHERE nome LIKE ? OR cpf LIKE ? OR rg LIKE ? OR telefone LIKE ? 
       ORDER BY nome DESC`,
      [termoBusca, termoBusca, termoBusca, termoBusca]
    );
    return rows;
  }
}

export default BeneficiarioModel;