import { jest } from "@jest/globals";
import ApiResponse from "../../../utils/ApiResponse.js";

const BeneficiarioServiceMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
  cadastrar: jest.fn(),
  atualizar: jest.fn(),
  excluir: jest.fn(),
};

jest.unstable_mockModule("../../../services/BeneficiarioService.js", () => ({
  default: BeneficiarioServiceMock,
}));

const { default: BeneficiarioController } = await import(
  "../../../controllers/BeneficiarioController.js"
);

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("BeneficiarioController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listarTodos deve retornar lista (happy path)", async () => {
    const req = { query: { termo: "Joao" } };
    const res = criarRes();
    const next = jest.fn();
    const lista = [{ cpf: "12345678901", nome: "Joao" }];

    BeneficiarioServiceMock.listarTodos.mockResolvedValue(lista);

    await BeneficiarioController.listarTodos(req, res, next);

    expect(BeneficiarioServiceMock.listarTodos).toHaveBeenCalledWith("Joao");
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(lista, "Beneficiários listados com sucesso")
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("buscarPorTermo deve encaminhar erro via next", async () => {
    const req = { params: { termo: "x" } };
    const res = criarRes();
    const next = jest.fn();
    const erro = new Error("falha no service");

    BeneficiarioServiceMock.buscarPorTermo.mockRejectedValue(erro);

    await BeneficiarioController.buscarPorTermo(req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });

  test("cadastrar deve responder 201 com payload", async () => {
    const req = { body: { nome: "Joao" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { id: 1, nome: "Joao" };

    BeneficiarioServiceMock.cadastrar.mockResolvedValue(retorno);

    await BeneficiarioController.cadastrar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Beneficiário cadastrado com sucesso")
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("atualizar deve retornar beneficiario atualizado", async () => {
    const req = { params: { cpfAntigo: "12345678901" }, body: { nome: "Novo" } };
    const res = criarRes();
    const next = jest.fn();
    const retorno = { cpf: "12345678901", nome: "Novo" };

    BeneficiarioServiceMock.atualizar.mockResolvedValue(retorno);

    await BeneficiarioController.atualizar(req, res, next);

    expect(BeneficiarioServiceMock.atualizar).toHaveBeenCalledWith("12345678901", {
      nome: "Novo",
    });
    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(retorno, "Beneficiário atualizado com sucesso")
    );
  });

  test("excluir deve retornar mensagem de sucesso", async () => {
    const req = { params: { cpf: "12345678901" } };
    const res = criarRes();
    const next = jest.fn();

    BeneficiarioServiceMock.excluir.mockResolvedValue({
      message: "Beneficiário excluído com sucesso",
    });

    await BeneficiarioController.excluir(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      ApiResponse.success(
        { message: "Beneficiário excluído com sucesso" },
        "Beneficiário excluído com sucesso"
      )
    );
  });
});
