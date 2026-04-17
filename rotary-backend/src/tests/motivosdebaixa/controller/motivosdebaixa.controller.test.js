import { jest } from "@jest/globals";
import ApiResponse from "../../../utils/ApiResponse.js";

const MotivosdebaixaServiceMock = {
  listarTodos: jest.fn(),
  cadastrar: jest.fn(),
  excluir: jest.fn(),
};

jest.unstable_mockModule("../../../services/MotivosdebaixaService.js", () => ({
  default: MotivosdebaixaServiceMock,
}));

const { default: MotivosdebaixaController } = await import(
  "../../../controllers/MotivosdebaixaController.js"
);

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("MotivosdebaixaController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listarTodos deve retornar motivos (happy path)", async () => {
    const req = {};
    const res = criarRes();
    const next = jest.fn();
    const lista = [{ id: 1, nome: "Perda total", status: "ATIVO" }];

    MotivosdebaixaServiceMock.listarTodos.mockResolvedValue(lista);

    await MotivosdebaixaController.listarTodos(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(lista, "Motivos de baixa listados com sucesso")
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("cadastrar deve responder 201 com motivo", async () => {
    const req = { body: { nome: "Avaria irreparavel", status: "ATIVO" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { id: 10, nome: "Avaria irreparavel", status: "ATIVO" };

    MotivosdebaixaServiceMock.cadastrar.mockResolvedValue(retorno);

    await MotivosdebaixaController.cadastrar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Motivo de baixa cadastrado com sucesso")
    );
  });

  test("excluir deve devolver mensagem de sucesso", async () => {
    const req = { params: { id: "2" } };
    const res = criarRes();
    const next = jest.fn();

    MotivosdebaixaServiceMock.excluir.mockResolvedValue({
      message: "Motivo de baixa excluído com sucesso",
    });

    await MotivosdebaixaController.excluir(req, res, next);

    expect(MotivosdebaixaServiceMock.excluir).toHaveBeenCalledWith("2");
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(
        { message: "Motivo de baixa excluído com sucesso" },
        "Motivo de baixa excluído com sucesso"
      )
    );
  });

  test("deve encaminhar erro via next", async () => {
    const req = { params: { id: "2" } };
    const res = criarRes();
    const next = jest.fn();
    const erro = new Error("falha no service");

    MotivosdebaixaServiceMock.excluir.mockRejectedValue(erro);

    await MotivosdebaixaController.excluir(req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });
});
