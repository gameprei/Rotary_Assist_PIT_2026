import AppError from "../utils/AppError.js";
import CategoriaModel from "../models/CategoriaModel.js";
import ValidationService from "./ValidationService.js";

class CategoriaService {
  static async listarTodos() {
    return await CategoriaModel.listarTodos();
  }

  static async buscarPorTermo(termo) {
    if (!termo) {
      throw new AppError("Termo de busca não informado", 400);
    }

    const categorias = await CategoriaModel.buscarPorTermo(termo);
    if (categorias.length === 0) {
      throw new AppError("Categoria não encontrada", 404);
    }

    return categorias;
  }

  static async cadastrar(data) {
    ValidationService.validarBody(data);
    ValidationService.validarCamposObrigatorios(data, [
      "nome",
      "tipo",
      "descricao",
    ]);

    const status = data.status ? String(data.status).toUpperCase() : "ATIVO";
    ValidationService.validarEnum(status, ["ATIVO", "INATIVO"], "Status inválido");

    const nomeExistente = await CategoriaModel.buscarPorNome(data.nome);
    if (nomeExistente) {
      throw new AppError("Já existe categoria com este nome", 409);
    }

    return await CategoriaModel.cadastrar({
      nome: data.nome,
      tipo: data.tipo,
      descricao: data.descricao,
      status,
    });
  }

  static async atualizar(id, data) {
    ValidationService.validarIdPositivo(id);
    ValidationService.validarBody(data, "Nenhum campo informado para atualização");

    const categoriaExistente = await CategoriaModel.buscarPorId(id);
    if (!categoriaExistente) {
      throw new AppError("Categoria não encontrada", 404);
    }

    const dadosAtualizacao = {};
    const camposPermitidos = ["nome", "tipo", "descricao", "status"];

    for (const campo of camposPermitidos) {
      if (Object.prototype.hasOwnProperty.call(data, campo)) {
        dadosAtualizacao[campo] = data[campo];
      }
    }

    if (Object.keys(dadosAtualizacao).length === 0) {
      throw new AppError("Nenhum campo válido informado para atualização", 400);
    }

    if (dadosAtualizacao.status) {
      dadosAtualizacao.status = String(dadosAtualizacao.status).toUpperCase();
      ValidationService.validarEnum(
        dadosAtualizacao.status,
        ["ATIVO", "INATIVO"],
        "Status inválido"
      );
    }

    if (dadosAtualizacao.nome) {
      const nomeExistente = await CategoriaModel.buscarPorNome(dadosAtualizacao.nome);
      if (nomeExistente && Number(nomeExistente.id) !== Number(id)) {
        throw new AppError("Já existe categoria com este nome", 409);
      }
    }

    return await CategoriaModel.atualizar(id, dadosAtualizacao);
  }

  static async excluir(id) {
    ValidationService.validarIdPositivo(id);

    const categoriaExistente = await CategoriaModel.buscarPorId(id);
    if (!categoriaExistente) {
      throw new AppError("Categoria não encontrada", 404);
    }

    const categoriaEmUso = await CategoriaModel.categoriaEmUso(id);
    if (categoriaEmUso) {
      throw new AppError("Categoria não pode ser excluída pois está em uso", 409);
    }

    await CategoriaModel.excluir(id);
    return { message: "Categoria excluída com sucesso" };
  }

  static async atualizarStatus(id, status) {
    ValidationService.validarIdPositivo(id);

    if (!status) {
      throw new AppError("Status é obrigatório", 400);
    }

    const statusNormalizado = String(status).toUpperCase();
    ValidationService.validarEnum(
      statusNormalizado,
      ["ATIVO", "INATIVO"],
      "Status inválido"
    );

    const categoria = await CategoriaModel.atualizarStatus(id, statusNormalizado);
    if (!categoria) {
      throw new AppError("Categoria não encontrada", 404);
    }

    return {
      message: "Status da categoria atualizado com sucesso",
      categoria,
    };
  }
}

export default CategoriaService;
