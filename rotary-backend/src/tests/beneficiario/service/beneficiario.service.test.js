import { jest } from "@jest/globals";

const BeneficiarioModelMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
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
  validarUF: jest.fn(),
  validarDataNascimento: jest.fn(),
  validarEmail: jest.fn(),
  validarTelefone: jest.fn(),
};

jest.unstable_mockModule("../../../models/BeneficiarioModel.js", () => ({
  default: BeneficiarioModelMock,
}));

jest.unstable_mockModule("../../../services/ValidationService.js", () => ({
  default: ValidationServiceMock,
}));

const { default: BeneficiarioService } = await import(
  "../../../services/BeneficiarioService.js"
);

function criarPayloadValido() {
  return {
    nome: "Joao Teste",
    cpf: "11122233344",
    rg: "123456789",
    data_nascimento: "1990-10-10",
    telefone: "11999999999",
    email: "joao@teste.com",
    endereco: "Rua Teste, 100",
    bairro: "Centro",
    cidade: "Sao Paulo",
    uf: "SP",
    cep: "01000000",
    contato_emergencia: "Maria",
    telefone_emergencia: "11988888888",
    necessidade_especifica: "Nenhuma",
  };
}

describe("BeneficiarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve cadastrar beneficiario com dados validos (happy path)", async () => {
    const payload = criarPayloadValido();
    const retornoModel = {
      status: "success",
      message: "Operacao realizada com sucesso",
      data: { id: 99, nome: payload.nome, cpf: payload.cpf },
    };

    BeneficiarioModelMock.validarCpfDuplicado.mockResolvedValue(false);
    BeneficiarioModelMock.cadastrar.mockResolvedValue(retornoModel);

    const resultado = await BeneficiarioService.cadastrar(payload);

    expect(ValidationServiceMock.validarBody).toHaveBeenCalledWith(payload);
    expect(BeneficiarioModelMock.validarCpfDuplicado).toHaveBeenCalledWith(payload.cpf);
    expect(BeneficiarioModelMock.cadastrar).toHaveBeenCalledWith(payload);
    expect(resultado).toEqual(retornoModel);
  });

  test("deve retornar conflito quando CPF ja existe", async () => {
    const payload = criarPayloadValido();
    BeneficiarioModelMock.validarCpfDuplicado.mockResolvedValue(true);

    await expect(BeneficiarioService.cadastrar(payload)).rejects.toMatchObject({
      message: "CPF já cadastrado para outro beneficiário",
      statusCode: 409,
    });
  });

  test("deve buscar por termo com sucesso", async () => {
    const retorno = [{ cpf: "12345678901", nome: "Joao" }];
    BeneficiarioModelMock.buscarPorTermo.mockResolvedValue(retorno);

    const resultado = await BeneficiarioService.buscarPorTermo("Joao");

    expect(resultado).toEqual(retorno);
  });

  test("deve falhar ao buscar por termo vazio", async () => {
    await expect(BeneficiarioService.buscarPorTermo()).rejects.toMatchObject({
      message: "Termo de busca não informado",
      statusCode: 400,
    });
  });

  test("deve retornar 404 quando busca por termo nao encontra resultado", async () => {
    BeneficiarioModelMock.buscarPorTermo.mockResolvedValue([]);

    await expect(BeneficiarioService.buscarPorTermo("cpf-inexistente")).rejects.toMatchObject({
      message: "Beneficiário não encontrado",
      statusCode: 404,
    });
  });

  test("deve atualizar somente campos permitidos", async () => {
    const dadosEntrada = {
      nome: "Nome Atualizado",
      cpf: "11122233344",
      campo_invalido: "nao deve ir para o model",
      necessidade_especifica: "Uso de andador",
    };

    BeneficiarioModelMock.validarCpfDuplicado.mockResolvedValue(false);
    BeneficiarioModelMock.atualizar.mockResolvedValue({
      cpf: "11122233344",
      nome: "Nome Atualizado",
    });

    const resultado = await BeneficiarioService.atualizar("12345678901", dadosEntrada);

    expect(BeneficiarioModelMock.atualizar).toHaveBeenCalledWith("12345678901", {
      nome: "Nome Atualizado",
      cpf: "11122233344",
      necessidade_especifica: "Uso de andador",
    });
    expect(resultado).toEqual({ cpf: "11122233344", nome: "Nome Atualizado" });
  });

  test("deve retornar 404 quando atualizar beneficiario inexistente", async () => {
    BeneficiarioModelMock.atualizar.mockResolvedValue(null);

    await expect(BeneficiarioService.atualizar("12345678901", { nome: "X" })).rejects.toMatchObject({
      message: "Beneficiário não encontrado",
      statusCode: 404,
    });
  });

  test("deve excluir beneficiario existente", async () => {
    BeneficiarioModelMock.excluir.mockResolvedValue(true);

    const resultado = await BeneficiarioService.excluir("12345678901");

    expect(resultado).toEqual({ message: "Beneficiário excluído com sucesso" });
  });

  test("deve retornar 404 ao excluir beneficiario inexistente", async () => {
    BeneficiarioModelMock.excluir.mockResolvedValue(false);

    await expect(BeneficiarioService.excluir("12345678901")).rejects.toMatchObject({
      message: "Beneficiário não encontrado",
      statusCode: 404,
    });
  });
});
