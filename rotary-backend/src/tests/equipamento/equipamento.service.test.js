import { jest } from "@jest/globals";

const EquipamentoModelMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
  buscarPorId: jest.fn(),
  existePatrimonioDuplicado: jest.fn(),
  existeNumeroSerieDuplicado: jest.fn(),
  categoriaAtivaExiste: jest.fn(),
  fornecedorAtivoExiste: jest.fn(),
  equipamentoEmprestado: jest.fn(),
  cadastrar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
  atualizarStatus: jest.fn(),
};

const ValidationServiceMock = {
  validarBody: jest.fn(),
  validarCamposObrigatorios: jest.fn(),
  validarIdPositivo: jest.fn(),
  validarEnum: jest.fn(),
};

jest.unstable_mockModule("../../models/EquipamentoModel.js", () => ({
  default: EquipamentoModelMock,
}));

jest.unstable_mockModule("../../services/ValidationService.js", () => ({
  default: ValidationServiceMock,
}));

const { default: EquipamentoService } = await import(
  "../../services/EquipamentoService.js"
);

describe("EquipamentoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve cadastrar equipamento com sucesso", async () => {
    const payload = {
      nome: "Cadeira",
      patrimonio: "PAT-1",
      categoria_id: 1,
      estado_conservacao: "BOM",
      data_aquisicao: "2024-01-10",
    };

    EquipamentoModelMock.existePatrimonioDuplicado.mockResolvedValue(false);
    EquipamentoModelMock.categoriaAtivaExiste.mockResolvedValue(true);
    EquipamentoModelMock.cadastrar.mockResolvedValue({ id: 1, ...payload });

    const resultado = await EquipamentoService.cadastrar(payload);

    expect(ValidationServiceMock.validarCamposObrigatorios).toHaveBeenCalled();
    expect(resultado).toEqual({ id: 1, ...payload });
  });

  test("deve retornar conflito para patrimonio duplicado", async () => {
    const payload = {
      nome: "Cadeira",
      patrimonio: "PAT-1",
      categoria_id: 1,
      estado_conservacao: "BOM",
      data_aquisicao: "2024-01-10",
    };

    EquipamentoModelMock.existePatrimonioDuplicado.mockResolvedValue(true);

    await expect(EquipamentoService.cadastrar(payload)).rejects.toMatchObject({
      message: "Já existe um equipamento cadastrado com este patrimônio",
      statusCode: 409,
    });
  });

  test("deve retornar 404 ao buscar por termo sem resultado", async () => {
    EquipamentoModelMock.buscarPorTermo.mockResolvedValue([]);

    await expect(EquipamentoService.buscarPorTermo("xyz")).rejects.toMatchObject({
      message: "Equipamento não encontrado",
      statusCode: 404,
    });
  });

  test("deve atualizar equipamento existente", async () => {
    EquipamentoModelMock.buscarPorId.mockResolvedValue({ id: 1, nome: "Atual" });
    EquipamentoModelMock.atualizar.mockResolvedValue({ id: 1, nome: "Atualizado" });

    const resultado = await EquipamentoService.atualizar(1, { nome: "Atualizado" });

    expect(resultado).toEqual({ id: 1, nome: "Atualizado" });
  });

  test("deve impedir exclusao de equipamento emprestado", async () => {
    EquipamentoModelMock.buscarPorId.mockResolvedValue({ id: 1, status: "EMPRESTADO" });
    EquipamentoModelMock.equipamentoEmprestado.mockResolvedValue(true);

    await expect(EquipamentoService.excluir(1)).rejects.toMatchObject({
      message: "Equipamento emprestado não pode ser excluído",
      statusCode: 409,
    });
  });

  test("deve atualizar status com sucesso", async () => {
    EquipamentoModelMock.atualizarStatus.mockResolvedValue({ id: 1, status: "BAIXADO" });

    const resultado = await EquipamentoService.atualizarStatus(1, "baixado");

    expect(resultado).toEqual({ id: 1, status: "BAIXADO" });
  });
});
