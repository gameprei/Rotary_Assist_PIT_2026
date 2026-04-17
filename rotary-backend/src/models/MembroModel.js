import pool from "../config/database.js";

class MembroModel {
  // Listar todos os membros
  static async listarTodos() {
    const [rows] = await pool.query("SELECT * FROM membros ORDER BY nome");
    return rows;
  }

  // Buscar membros por cpf || nome || rg
  static async buscarPorTermo(termo) {
    const query = `
      SELECT * FROM membros
      WHERE nome LIKE ? OR cpf LIKE ? OR rg LIKE ?
      ORDER BY nome
    `;
    const likeTermo = `%${termo}%`;
    const [rows] = await pool.query(query, [likeTermo, likeTermo, likeTermo]);
    return rows;
  }

  static async buscarPorCpf(cpf) {
    const [rows] = await pool.query(
      "SELECT * FROM membros WHERE cpf = ? LIMIT 1",
      [cpf]
    );

    return rows[0] || null;
  }

  static async validarCpfDuplicado(cpf, cpfIgnorado = null) {
    if (cpfIgnorado) {
      const [rows] = await pool.query(
        "SELECT cpf FROM membros WHERE cpf = ? AND cpf <> ? LIMIT 1",
        [cpf, cpfIgnorado]
      );
      return rows.length > 0;
    }

    const [rows] = await pool.query(
      "SELECT cpf FROM membros WHERE cpf = ? LIMIT 1",
      [cpf]
    );
    return rows.length > 0;
  }

  // Cadastrar novo membro
  static async cadastrar(membro) {
    const {
      nome,
      cpf,
      rg,
      email,
      telefone,
      data_nascimento,
      data_ingresso,
      endereco,
      bairro,
      cidade,
      uf, 
      cep,
      cargo,
      profissao,
      empresa,
    } = membro;
    
    const [result] = await pool.query(
      `INSERT INTO membros
        (nome, cpf, rg, email, telefone, data_nascimento, data_ingresso, endereco, bairro, cidade, uf, cep, cargo, profissao, empresa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        cpf,
        rg,
        email,
        telefone,
        data_nascimento,
        data_ingresso,
        endereco,
        bairro,
        cidade,
        uf,
        cep,
        cargo,
        profissao,
        empresa,
      ]
    );
    return { id: result.insertId, ...membro };
  }

  // Atualizar membro existente
  static async atualizar(cpfAntigo, membro) {
    const [result] = await pool.query(`UPDATE membros SET ? WHERE cpf = ?`, [
      membro,
      cpfAntigo,
    ]);
    
    if (result.affectedRows === 0) {
      return null;
    }

    const cpfAtual = membro.cpf || cpfAntigo;
    return await this.buscarPorCpf(cpfAtual);
  }

  // Deletar membro
  static async excluir(cpf) {
    const [result] = await pool.query(`DELETE FROM membros WHERE cpf = ?`, [cpf]);
    return result.affectedRows > 0;
  }

  // Filtrar membros por termo nome||cpf||rg|| cargo
  static async filtrarPorTermo(termo) {
    const query = `
      SELECT * FROM membros
      WHERE nome LIKE ? OR cpf LIKE ? OR rg LIKE ? OR cargo LIKE ?
      ORDER BY nome
    `;
    const likeTermo = `%${termo}%`;
    const [rows] = await pool.query(query, [
      likeTermo,
      likeTermo,
      likeTermo,
      likeTermo,
    ]);
    return rows;
  }
}

export default MembroModel;