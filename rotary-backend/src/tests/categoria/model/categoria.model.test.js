import CategoriaModel from "../../../models/CategoriaModel.js";
import "../../setup.js";

describe("CategoriaModel", () => {
  function dadosCategoria(nome = "Categoria Teste") {
    return {
      nome,
      tipo: "MOBILIDADE",
      descricao: "Descricao de teste",
      status: "ATIVO",
    };
  }

  test("deve listar categorias", async () => {
    const resultado = await CategoriaModel.listarTodos();

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("deve buscar por termo nome", async () => {
    const resultado = await CategoriaModel.buscarPorTermo("cadeira");

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  test("deve buscar por id", async () => {
    const categoria = await CategoriaModel.buscarPorId(1);

    expect(categoria).not.toBeNull();
    expect(categoria.id).toBe(1);
  });

  test("deve buscar por nome exato", async () => {
    const categoria = await CategoriaModel.buscarPorNome("Cadeira de rodas");

    expect(categoria).not.toBeNull();
    expect(categoria.nome).toBe("Cadeira de rodas");
  });

  test("deve identificar categoria em uso", async () => {
    const emUso = await CategoriaModel.categoriaEmUso(1);

    expect(emUso).toBe(true);
  });

  test("deve cadastrar nova categoria", async () => {
    const payload = dadosCategoria("Nova Categoria Model");

    const resultado = await CategoriaModel.cadastrar(payload);

    expect(resultado).toHaveProperty("id");
    expect(resultado.nome).toBe("Nova Categoria Model");
    expect(resultado.status).toBe("ATIVO");
  });

  test("deve atualizar categoria existente", async () => {
    const resultado = await CategoriaModel.atualizar(2, {
      nome: "Cadeira de banho Atualizada",
      descricao: "Descricao atualizada",
    });

    expect(resultado).not.toBeNull();
    expect(resultado.nome).toBe("Cadeira de banho Atualizada");
  });

  test("deve retornar null ao atualizar categoria inexistente", async () => {
    const resultado = await CategoriaModel.atualizar(999, {
      nome: "Nao existe",
    });

    expect(resultado).toBeNull();
  });

  test("deve atualizar status da categoria", async () => {
    const resultado = await CategoriaModel.atualizarStatus(3, "INATIVO");

    expect(resultado).not.toBeNull();
    expect(resultado.id).toBe(3);
    expect(resultado.status).toBe("INATIVO");
  });

  test("deve retornar null ao atualizar status de categoria inexistente", async () => {
    const resultado = await CategoriaModel.atualizarStatus(999, "ATIVO");

    expect(resultado).toBeNull();
  });

  test("deve excluir categoria existente sem uso", async () => {
    const nova = await CategoriaModel.cadastrar(dadosCategoria("Categoria Para Excluir"));

    const excluiu = await CategoriaModel.excluir(nova.id);

    expect(excluiu).toBe(true);
  });
});
