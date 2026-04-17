import MotivosdebaixaModel from "../../../models/MotivosdebaixaModel.js";
import pool from "../../../config/database.js";
import "../../setup.js";

describe("MotivosdebaixaModel", () => {
  test("deve listar motivos de baixa", async () => {
    const resultado = await MotivosdebaixaModel.listarTodos();

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("deve buscar motivo por id", async () => {
    const motivo = await MotivosdebaixaModel.buscarPorId(1);

    expect(motivo).not.toBeNull();
    expect(motivo.id).toBe(1);
  });

  test("deve buscar motivo por nome", async () => {
    const motivo = await MotivosdebaixaModel.buscarPorNome("Perda total");

    expect(motivo).not.toBeNull();
    expect(motivo.nome).toBe("Perda total");
  });

  test("deve cadastrar novo motivo", async () => {
    const payload = {
      nome: "Avaria de estrutura",
      status: "ATIVO",
    };

    const resultado = await MotivosdebaixaModel.cadastrar(payload);

    expect(resultado).toHaveProperty("id");
    expect(resultado.nome).toBe("Avaria de estrutura");
    expect(resultado.status).toBe("ATIVO");
  });

  test("deve identificar motivo em uso", async () => {
    const motivo = await MotivosdebaixaModel.cadastrar({
      nome: "Motivo em uso",
      status: "ATIVO",
    });

    await pool.query(
      `INSERT INTO baixas_equipamento (equipamento_id, motivo_id, data_baixa, observacao)
       VALUES (?, ?, CURDATE(), ?)`,
      [1, motivo.id, "Baixa para teste"]
    );

    const emUso = await MotivosdebaixaModel.motivoEmUso(motivo.id);

    expect(emUso).toBe(true);
  });

  test("deve excluir motivo existente sem uso", async () => {
    const novo = await MotivosdebaixaModel.cadastrar({
      nome: "Motivo para excluir",
      status: "ATIVO",
    });

    const excluiu = await MotivosdebaixaModel.excluir(novo.id);

    expect(excluiu).toBe(true);
  });
});
