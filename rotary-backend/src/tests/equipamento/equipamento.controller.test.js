import { jest } from "@jest/globals";
import ApiResponse from "../../utils/ApiResponse.js";

const EquipamentoServiceMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
  cadastrar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
  atualizarStatus: jest.fn(),
};

jest.unstable_mockModule("../../services/EquipamentoService.js", () => ({
  default: EquipamentoServiceMock,
}));

const { default: EquipamentoController } = await import(
  "../../controllers/EquipamentoController.js"
);

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("EquipamentoController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listarTodos deve retornar lista padronizada", async () => {
    const req = { query: {} };
    const res = criarRes();
    const next = jest.fn();
    const lista = [{ id: 1, nome: "Cadeira" }];

    EquipamentoServiceMock.listarTodos.mockResolvedValue(lista);

    await EquipamentoController.listarTodos(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(lista, "Equipamentos listados com sucesso")
    );
  });

  test("cadastrar deve retornar 201 padronizado", async () => {
    const req = { body: { nome: "Cadeira" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { id: 1, nome: "Cadeira" };

    EquipamentoServiceMock.cadastrar.mockResolvedValue(retorno);

    await EquipamentoController.cadastrar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Equipamento cadastrado com sucesso")
    );
  });

  test("atualizar deve delegar ao service", async () => {
    const req = { params: { id: "1" }, body: { nome: "Novo" } };
    const res = criarRes();
    const next = jest.fn();

    EquipamentoServiceMock.atualizar.mockResolvedValue({ id: 1, nome: "Novo" });

    await EquipamentoController.atualizar(req, res, next);

    expect(EquipamentoServiceMock.atualizar).toHaveBeenCalledWith("1", { nome: "Novo" });
  });

  test("deve encaminhar erro via next", async () => {
    const req = { params: { termo: "x" } };
    const res = criarRes();
    const next = jest.fn();
    const erro = new Error("falha");

    EquipamentoServiceMock.buscarPorTermo.mockRejectedValue(erro);

    await EquipamentoController.buscarPorTermo(req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });
});
