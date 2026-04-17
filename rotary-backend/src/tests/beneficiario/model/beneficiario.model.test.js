import BeneficiarioModel from "../../../models/BeneficiarioModel.js";
import "../../setup.js";

describe("BeneficiarioModel", () => {
  function dadosCadastro(cpf = "55566677788") {
    return {
      nome: "Carlos Teste",
      cpf,
      rg: "998877665",
      data_nascimento: "1992-04-01",
      telefone: "11911112222",
      email: "carlos@teste.com",
      endereco: "Rua B, 200",
      bairro: "Centro",
      cidade: "Sao Paulo",
      uf: "SP",
      cep: "01000000",
      contato_emergencia: "Ana",
      telefone_emergencia: "11933334444",
      necessidade_especifica: "Nenhuma",
    };
  }

  test("deve listar beneficiarios", async () => {
    const resultado = await BeneficiarioModel.listarTodos();

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("deve buscar por CPF existente", async () => {
    const beneficiario = await BeneficiarioModel.buscarPorCpf("12345678901");

    expect(beneficiario).not.toBeNull();
    expect(beneficiario.cpf).toBe("12345678901");
  });

  test("deve validar CPF duplicado existente", async () => {
    const duplicado = await BeneficiarioModel.validarCpfDuplicado("12345678901");

    expect(duplicado).toBe(true);
  });

  test("deve ignorar o mesmo CPF na validacao de duplicidade ao atualizar", async () => {
    const duplicado = await BeneficiarioModel.validarCpfDuplicado(
      "12345678901",
      "12345678901"
    );

    expect(duplicado).toBe(false);
  });

  test("deve cadastrar beneficiario e retornar resposta padrao", async () => {
    const payload = dadosCadastro("55566677788");

    const resultado = await BeneficiarioModel.cadastrar(payload);

    expect(resultado.status).toBe("success");
    expect(resultado.data).toHaveProperty("id");
    expect(resultado.data.cpf).toBe("55566677788");
  });

  test("deve atualizar beneficiario existente", async () => {
    const resultado = await BeneficiarioModel.atualizar("12345678901", {
      nome: "Joao Atualizado",
      cpf: "12345678955",
    });

    expect(resultado).not.toBeNull();
    expect(resultado.nome).toBe("Joao Atualizado");
    expect(resultado.cpf).toBe("12345678955");
  });

  test("deve retornar null ao atualizar beneficiario inexistente", async () => {
    const resultado = await BeneficiarioModel.atualizar("00000000000", {
      nome: "Nao existe",
    });

    expect(resultado).toBeNull();
  });

  test("deve lancar erro ao atualizar sem dados", async () => {
    await expect(BeneficiarioModel.atualizar("12345678901", {})).rejects.toThrow(
      "Nenhum dado fornecido para atualização"
    );
  });

  test("deve excluir beneficiario existente", async () => {
    const novo = await BeneficiarioModel.cadastrar(dadosCadastro("99988877766"));

    const excluiu = await BeneficiarioModel.excluir(novo.data.cpf);

    expect(excluiu).toBe(true);
  });
});
