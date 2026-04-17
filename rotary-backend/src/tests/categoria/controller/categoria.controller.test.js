import { jest } from "@jest/globals";
import ApiResponse from "../../../utils/ApiResponse.js";

const CategoriaServiceMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
  cadastrar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
  atualizarStatus: jest.fn(),
};

jest.unstable_mockModule("../../../services/CategoriaService.js", () => ({
  default: CategoriaServiceMock,
}));

const { default: CategoriaController } = await import(
  "../../../controllers/CategoriaController.js"
);

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("CategoriaController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listarTodos deve retornar categorias (happy path)", async () => {
    const req = {};
    const res = criarRes();
    const next = jest.fn();
    const lista = [{ id: 1, nome: "Cadeira de rodas" }];

    CategoriaServiceMock.listarTodos.mockResolvedValue(lista);

    await CategoriaController.listarTodos(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(lista, "Categorias listadas com sucesso")
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("buscarPorTermo deve encaminhar erro via next", async () => {
    const req = { params: { termo: "x" } };
    const res = criarRes();
    const next = jest.fn();
    const erro = new Error("falha no service");

    CategoriaServiceMock.buscarPorTermo.mockRejectedValue(erro);

    await CategoriaController.buscarPorTermo(req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });

  test("cadastrar deve responder 201 com categoria", async () => {
    const req = {
      body: { nome: "Nova", tipo: "LEITO", descricao: "x", status: "ATIVO" },
    };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { id: 10, nome: "Nova" };

    CategoriaServiceMock.cadastrar.mockResolvedValue(retorno);

    await CategoriaController.cadastrar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Categoria cadastrada com sucesso")
    );
  });

  test("atualizar deve devolver categoria atualizada", async () => {
    const req = { params: { id: "2" }, body: { nome: "Atualizada" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { id: 2, nome: "Atualizada" };

    CategoriaServiceMock.atualizar.mockResolvedValue(retorno);

    await CategoriaController.atualizar(req, res, next);

    expect(CategoriaServiceMock.atualizar).toHaveBeenCalledWith("2", {
      nome: "Atualizada",
    });
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Categoria atualizada com sucesso")
    );
  });

  test("excluir deve devolver mensagem de sucesso", async () => {
    const req = { params: { id: "3" } };
    const res = criarRes();
    const next = jest.fn();

    CategoriaServiceMock.excluir.mockResolvedValue({
      message: "Categoria excluída com sucesso",
    });

    await CategoriaController.excluir(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(
        { message: "Categoria excluída com sucesso" },
        "Categoria excluída com sucesso"
      )
    );
  });

  test("atualizarStatus deve devolver payload padronizado", async () => {
    const req = { params: { id: "4" }, body: { status: "INATIVO" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = {
      message: "Status da categoria atualizado com sucesso",
      categoria: { id: 4, status: "INATIVO" },
    };

    CategoriaServiceMock.atualizarStatus.mockResolvedValue(retorno);

    await CategoriaController.atualizarStatus(req, res, next);

    expect(CategoriaServiceMock.atualizarStatus).toHaveBeenCalledWith("4", "INATIVO");
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Status de categoria atualizado com sucesso")
    );
  });
});
