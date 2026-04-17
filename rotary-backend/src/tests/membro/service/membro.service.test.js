import { jest } from "@jest/globals";

const MembroModelMock = {
  listarTodos: jest.fn(),
  filtrarPorTermo: jest.fn(),
  validarCpfDuplicado: jest.fn(),
  cadastrar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
};

const ValidationServiceMock = {
  validarBody: jest.fn(),
  validarCamposObrigatorios: jest.fn(),
  validarCPF: jest.fn(),
  validarRg: jest.fn(),
  validarEmail: jest.fn(),
  validarTelefone: jest.fn(),
  validarDataNascimento: jest.fn(),
  validarUF: jest.fn(),
};

jest.unstable_mockModule("../../../models/MembroModel.js", () => ({
  default: MembroModelMock,
}));

jest.unstable_mockModule("../../../services/ValidationService.js", () => ({
  default: ValidationServiceMock,
}));

const { default: MembroService } = await import("../../../services/MembroService.js");

function payloadValido() {
  return {
    nome: "Membro Teste",
    cpf: "12345678901",
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

describe("MembroService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve cadastrar membro com sucesso", async () => {
    const payload = payloadValido();
    MembroModelMock.validarCpfDuplicado.mockResolvedValue(false);
    MembroModelMock.cadastrar.mockResolvedValue({ id: 1, ...payload });

    const resultado = await MembroService.cadastrar(payload);

    expect(MembroModelMock.cadastrar).toHaveBeenCalledWith(payload);
    expect(resultado).toHaveProperty("id", 1);
  });

  test("deve retornar conflito para CPF duplicado", async () => {
    const payload = payloadValido();
    MembroModelMock.validarCpfDuplicado.mockResolvedValue(true);

    await expect(MembroService.cadastrar(payload)).rejects.toMatchObject({
      message: "CPF já cadastrado para outro membro",
      statusCode: 409,
    });
  });

  test("deve retornar 400 para data de ingresso invalida", async () => {
    const payload = payloadValido();
    payload.data_ingresso = "data-invalida";

    await expect(MembroService.cadastrar(payload)).rejects.toMatchObject({
      message: "Data de ingresso inválida",
      statusCode: 400,
    });
  });

  test("deve buscar membros por termo", async () => {
    MembroModelMock.filtrarPorTermo.mockResolvedValue([{ cpf: "12345678901" }]);

    const resultado = await MembroService.buscarPorTermo("12345678901");

    expect(resultado.length).toBe(1);
  });

  test("deve retornar 404 quando nao encontrar membro por termo", async () => {
    MembroModelMock.filtrarPorTermo.mockResolvedValue([]);

    await expect(MembroService.buscarPorTermo("nao-existe")).rejects.toMatchObject({
      message: "Membro não encontrado",
      statusCode: 404,
    });
  });

  test("deve atualizar membro com sucesso", async () => {
    MembroModelMock.validarCpfDuplicado.mockResolvedValue(false);
    MembroModelMock.atualizar.mockResolvedValue({ cpf: "12345678901", nome: "Novo" });

    const resultado = await MembroService.atualizar("12345678901", { nome: "Novo" });

    expect(resultado.nome).toBe("Novo");
  });

  test("deve retornar 404 ao atualizar membro inexistente", async () => {
    MembroModelMock.atualizar.mockResolvedValue(null);

    await expect(MembroService.atualizar("12345678901", { nome: "X" })).rejects.toMatchObject({
      message: "Membro não encontrado",
      statusCode: 404,
    });
  });

  test("deve excluir membro com sucesso", async () => {
    MembroModelMock.excluir.mockResolvedValue(true);

    const resultado = await MembroService.excluir("12345678901");

    expect(resultado).toEqual({ message: "Membro excluído com sucesso" });
  });

  test("deve retornar 404 ao excluir membro inexistente", async () => {
    MembroModelMock.excluir.mockResolvedValue(false);

    await expect(MembroService.excluir("12345678901")).rejects.toMatchObject({
      message: "Membro não encontrado",
      statusCode: 404,
    });
  });
});
