import { jest } from "@jest/globals";

const MotivosdebaixaModelMock = {
  listarTodos: jest.fn(),
  buscarPorId: jest.fn(),
  buscarPorNome: jest.fn(),
  motivoEmUso: jest.fn(),
  cadastrar: jest.fn(),
  excluir: jest.fn(),
};

const ValidationServiceMock = {
  validarBody: jest.fn(),
  validarCamposObrigatorios: jest.fn(),
  validarIdPositivo: jest.fn(),
  validarEnum: jest.fn(),
};

jest.unstable_mockModule("../../../models/MotivosdebaixaModel.js", () => ({
  default: MotivosdebaixaModelMock,
}));

jest.unstable_mockModule("../../../services/ValidationService.js", () => ({
  default: ValidationServiceMock,
}));

const { default: MotivosdebaixaService } = await import(
  "../../../services/MotivosdebaixaService.js"
);

describe("MotivosdebaixaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve listar motivos com sucesso (happy path)", async () => {
    const lista = [{ id: 1, nome: "Perda total", status: "ATIVO" }];
    MotivosdebaixaModelMock.listarTodos.mockResolvedValue(lista);

    const resultado = await MotivosdebaixaService.listarTodos();

    expect(resultado).toEqual(lista);
  });

  test("deve cadastrar motivo com sucesso", async () => {
    const payload = { nome: "Avaria irreparavel", status: "inativo" };
    const retorno = { id: 10, nome: "Avaria irreparavel", status: "INATIVO" };

    MotivosdebaixaModelMock.buscarPorNome.mockResolvedValue(null);
    MotivosdebaixaModelMock.cadastrar.mockResolvedValue(retorno);

    const resultado = await MotivosdebaixaService.cadastrar(payload);

    expect(ValidationServiceMock.validarBody).toHaveBeenCalledWith(payload);
    expect(ValidationServiceMock.validarCamposObrigatorios).toHaveBeenCalledWith(payload, ["nome"]);
    expect(ValidationServiceMock.validarEnum).toHaveBeenCalledWith(
      "INATIVO",
      ["ATIVO", "INATIVO"],
      "Status inválido"
    );
    expect(MotivosdebaixaModelMock.cadastrar).toHaveBeenCalledWith({
      nome: "Avaria irreparavel",
      status: "INATIVO",
    });
    expect(resultado).toEqual(retorno);
  });

  test("deve retornar 409 ao cadastrar motivo com nome duplicado", async () => {
    MotivosdebaixaModelMock.buscarPorNome.mockResolvedValue({ id: 1, nome: "Perda total" });

    await expect(MotivosdebaixaService.cadastrar({ nome: "Perda total" })).rejects.toMatchObject({
      message: "Já existe motivo de baixa com este nome",
      statusCode: 409,
    });
  });

  test("deve retornar 400 ao cadastrar nome vazio", async () => {
    await expect(MotivosdebaixaService.cadastrar({ nome: "   " })).rejects.toMatchObject({
      message: "Nome do motivo de baixa é obrigatório",
      statusCode: 400,
    });
  });

  test("deve excluir motivo com sucesso", async () => {
    MotivosdebaixaModelMock.buscarPorId.mockResolvedValue({ id: 2, nome: "Fim da vida util" });
    MotivosdebaixaModelMock.motivoEmUso.mockResolvedValue(false);
    MotivosdebaixaModelMock.excluir.mockResolvedValue(true);

    const resultado = await MotivosdebaixaService.excluir(2);

    expect(ValidationServiceMock.validarIdPositivo).toHaveBeenCalledWith(2);
    expect(resultado).toEqual({ message: "Motivo de baixa excluído com sucesso" });
  });

  test("deve retornar 404 ao excluir motivo inexistente", async () => {
    MotivosdebaixaModelMock.buscarPorId.mockResolvedValue(null);

    await expect(MotivosdebaixaService.excluir(999)).rejects.toMatchObject({
      message: "Motivo de baixa não encontrado",
      statusCode: 404,
    });
  });

  test("deve retornar 409 ao excluir motivo em uso", async () => {
    MotivosdebaixaModelMock.buscarPorId.mockResolvedValue({ id: 1, nome: "Perda total" });
    MotivosdebaixaModelMock.motivoEmUso.mockResolvedValue(true);

    await expect(MotivosdebaixaService.excluir(1)).rejects.toMatchObject({
      message: "Motivo de baixa não pode ser excluído pois está em uso",
      statusCode: 409,
    });
  });
});
