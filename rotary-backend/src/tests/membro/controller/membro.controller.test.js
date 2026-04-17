import { jest } from "@jest/globals";
import ApiResponse from "../../../utils/ApiResponse.js";

const MembroServiceMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
  cadastrar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
};

jest.unstable_mockModule("../../../services/MembroService.js", () => ({
  default: MembroServiceMock,
}));

const { default: MembroController } = await import("../../../controllers/MembroController.js");

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("MembroController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listarTodos deve retornar payload padronizado", async () => {
    const req = { query: {} };
    const res = criarRes();
    const next = jest.fn();
    const lista = [{ cpf: "12345678901", nome: "Joao" }];

    MembroServiceMock.listarTodos.mockResolvedValue(lista);

    await MembroController.listarTodos(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(lista, "Membros listados com sucesso")
    );
  });

  test("buscarPorTermo deve encaminhar erro via next", async () => {
    const req = { params: { termo: "x" } };
    const res = criarRes();
    const next = jest.fn();
    const erro = new Error("falha");

    MembroServiceMock.buscarPorTermo.mockRejectedValue(erro);

    await MembroController.buscarPorTermo(req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });

  test("cadastrar deve responder 201 padronizado", async () => {
    const req = { body: { nome: "Novo" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { id: 1, nome: "Novo" };

    MembroServiceMock.cadastrar.mockResolvedValue(retorno);

    await MembroController.cadastrar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Membro cadastrado com sucesso")
    );
  });

  test("atualizar deve delegar ao service", async () => {
    const req = { params: { cpfAntigo: "12345678901" }, body: { nome: "Novo" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { cpf: "12345678901", nome: "Novo" };

    MembroServiceMock.atualizar.mockResolvedValue(retorno);

    await MembroController.atualizar(req, res, next);

    expect(MembroServiceMock.atualizar).toHaveBeenCalledWith("12345678901", {
      nome: "Novo",
    });
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Membro atualizado com sucesso")
    );
  });

  test("excluir deve responder sucesso padronizado", async () => {
    const req = { params: { cpf: "12345678901" } };
    const res = criarRes();
    const next = jest.fn();

    MembroServiceMock.excluir.mockResolvedValue({ message: "Membro excluído com sucesso" });

    await MembroController.excluir(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success({ message: "Membro excluído com sucesso" }, "Membro excluído com sucesso")
    );
  });
});
