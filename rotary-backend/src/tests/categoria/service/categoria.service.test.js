import { jest } from "@jest/globals";

const CategoriaModelMock = {
  listarTodos: jest.fn(),
  buscarPorTermo: jest.fn(),
  buscarPorNome: jest.fn(),
  buscarPorId: jest.fn(),
  categoriaEmUso: jest.fn(),
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

jest.unstable_mockModule("../../../models/CategoriaModel.js", () => ({
  default: CategoriaModelMock,
}));

jest.unstable_mockModule("../../../services/ValidationService.js", () => ({
  default: ValidationServiceMock,
}));

const { default: CategoriaService } = await import(
  "../../../services/CategoriaService.js"
);

describe("CategoriaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve listar categorias com sucesso (happy path)", async () => {
    const lista = [{ id: 1, nome: "Cadeira de rodas", tipo: "MOBILIDADE" }];
    CategoriaModelMock.listarTodos.mockResolvedValue(lista);

    const resultado = await CategoriaService.listarTodos();

    expect(resultado).toEqual(lista);
  });

  test("deve buscar categoria por termo com sucesso", async () => {
    const retorno = [{ id: 1, nome: "Cadeira de rodas" }];
    CategoriaModelMock.buscarPorTermo.mockResolvedValue(retorno);

    const resultado = await CategoriaService.buscarPorTermo("cadeira");

    expect(CategoriaModelMock.buscarPorTermo).toHaveBeenCalledWith("cadeira");
    expect(resultado).toEqual(retorno);
  });

  test("deve falhar ao buscar por termo vazio", async () => {
    await expect(CategoriaService.buscarPorTermo()).rejects.toMatchObject({
      message: "Termo de busca não informado",
      statusCode: 400,
    });
  });

  test("deve retornar 404 quando termo nao encontra categoria", async () => {
    CategoriaModelMock.buscarPorTermo.mockResolvedValue([]);

    await expect(CategoriaService.buscarPorTermo("inexistente")).rejects.toMatchObject({
      message: "Categoria não encontrada",
      statusCode: 404,
    });
  });

  test("deve cadastrar categoria com sucesso", async () => {
    const payload = {
      nome: "Nova categoria",
      tipo: "LEITO",
      descricao: "Descricao teste",
      status: "ativo",
    };

    const retorno = { id: 10, ...payload, status: "ATIVO" };

    CategoriaModelMock.buscarPorNome.mockResolvedValue(null);
    CategoriaModelMock.cadastrar.mockResolvedValue(retorno);

    const resultado = await CategoriaService.cadastrar(payload);

    expect(ValidationServiceMock.validarBody).toHaveBeenCalledWith(payload);
    expect(ValidationServiceMock.validarCamposObrigatorios).toHaveBeenCalled();
    expect(ValidationServiceMock.validarEnum).toHaveBeenCalledWith(
      "ATIVO",
      ["ATIVO", "INATIVO"],
      "Status inválido"
    );
    expect(CategoriaModelMock.cadastrar).toHaveBeenCalledWith({
      nome: "Nova categoria",
      tipo: "LEITO",
      descricao: "Descricao teste",
      status: "ATIVO",
    });
    expect(resultado).toEqual(retorno);
  });

  test("deve retornar 409 ao cadastrar categoria com nome duplicado", async () => {
    CategoriaModelMock.buscarPorNome.mockResolvedValue({ id: 1, nome: "Duplicada" });

    await expect(
      CategoriaService.cadastrar({
        nome: "Duplicada",
        tipo: "LEITO",
        descricao: "x",
      })
    ).rejects.toMatchObject({
      message: "Já existe categoria com este nome",
      statusCode: 409,
    });
  });

  test("deve atualizar categoria e manter somente campos permitidos", async () => {
    const dados = {
      nome: "Categoria atualizada",
      status: "inativo",
      campo_invalido: "deve ser ignorado",
    };

    CategoriaModelMock.buscarPorId.mockResolvedValue({ id: 2, nome: "Atual" });
    CategoriaModelMock.buscarPorNome.mockResolvedValue(null);
    CategoriaModelMock.atualizar.mockResolvedValue({
      id: 2,
      nome: "Categoria atualizada",
      status: "INATIVO",
    });

    const resultado = await CategoriaService.atualizar(2, dados);

    expect(ValidationServiceMock.validarIdPositivo).toHaveBeenCalledWith(2);
    expect(CategoriaModelMock.atualizar).toHaveBeenCalledWith(2, {
      nome: "Categoria atualizada",
      status: "INATIVO",
    });
    expect(resultado.status).toBe("INATIVO");
  });

  test("deve retornar 404 ao atualizar categoria inexistente", async () => {
    CategoriaModelMock.buscarPorId.mockResolvedValue(null);

    await expect(CategoriaService.atualizar(999, { nome: "X" })).rejects.toMatchObject({
      message: "Categoria não encontrada",
      statusCode: 404,
    });
  });

  test("deve retornar 409 ao excluir categoria em uso", async () => {
    CategoriaModelMock.buscarPorId.mockResolvedValue({ id: 1 });
    CategoriaModelMock.categoriaEmUso.mockResolvedValue(true);

    await expect(CategoriaService.excluir(1)).rejects.toMatchObject({
      message: "Categoria não pode ser excluída pois está em uso",
      statusCode: 409,
    });
  });

  test("deve excluir categoria com sucesso", async () => {
    CategoriaModelMock.buscarPorId.mockResolvedValue({ id: 2 });
    CategoriaModelMock.categoriaEmUso.mockResolvedValue(false);
    CategoriaModelMock.excluir.mockResolvedValue(true);

    const resultado = await CategoriaService.excluir(2);

    expect(resultado).toEqual({ message: "Categoria excluída com sucesso" });
  });

  test("deve atualizar status com sucesso", async () => {
    CategoriaModelMock.atualizarStatus.mockResolvedValue({
      id: 3,
      nome: "Muleta",
      status: "INATIVO",
    });

    const resultado = await CategoriaService.atualizarStatus(3, "inativo");

    expect(ValidationServiceMock.validarIdPositivo).toHaveBeenCalledWith(3);
    expect(ValidationServiceMock.validarEnum).toHaveBeenCalledWith(
      "INATIVO",
      ["ATIVO", "INATIVO"],
      "Status inválido"
    );
    expect(resultado).toEqual({
      message: "Status da categoria atualizado com sucesso",
      categoria: { id: 3, nome: "Muleta", status: "INATIVO" },
    });
  });

  test("deve falhar ao atualizar status sem valor", async () => {
    await expect(CategoriaService.atualizarStatus(1)).rejects.toMatchObject({
      message: "Status é obrigatório",
      statusCode: 400,
    });
  });
});
