import MembroModel from "../../../models/MembroModel.js";
import "../../setup.js";

describe("MembroModel", () => {
  function payload(cpf = "11122233344") {
    return {
      nome: "Membro Teste",
      cpf,
      rg: "123456789",
      email: "membro@teste.com",
      telefone: "11999999999",
      data_nascimento: "1990-01-01",
      data_ingresso: "2024-01-01",
      endereco: "Rua A",
      bairro: "Centro",
      cidade: "Sao Paulo",
      uf: "SP",
      cep: "01000000",
      cargo: "Presidente",
      profissao: "Medico",
      empresa: "Empresa X",
    };
  }

  test("deve listar membros", async () => {
    const resultado = await MembroModel.listarTodos();

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("deve buscar por cpf", async () => {
    const resultado = await MembroModel.buscarPorCpf("98765432100");

    expect(resultado).not.toBeNull();
    expect(resultado.cpf).toBe("98765432100");
  });

  test("deve validar cpf duplicado existente", async () => {
    const duplicado = await MembroModel.validarCpfDuplicado("98765432100");

    expect(duplicado).toBe(true);
  });

  test("deve cadastrar membro", async () => {
    const resultado = await MembroModel.cadastrar(payload("11122233344"));

    expect(resultado).toHaveProperty("id");
    expect(resultado.cpf).toBe("11122233344");
  });

  test("deve atualizar membro existente", async () => {
    const resultado = await MembroModel.atualizar("98765432100", {
      nome: "Maria Atualizada",
      cpf: "98765432199",
    });

    expect(resultado).not.toBeNull();
    expect(resultado.cpf).toBe("98765432199");
  });

  test("deve retornar null ao atualizar membro inexistente", async () => {
    const resultado = await MembroModel.atualizar("00000000000", {
      nome: "Nao existe",
    });

    expect(resultado).toBeNull();
  });

  test("deve excluir membro existente", async () => {
    await MembroModel.cadastrar(payload("11122233355"));

    const excluiu = await MembroModel.excluir("11122233355");

    expect(excluiu).toBe(true);
  });
});
