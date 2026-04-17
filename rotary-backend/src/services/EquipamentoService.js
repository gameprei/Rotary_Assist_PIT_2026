import AppError from "../utils/AppError.js";
import EquipamentoModel from "../models/EquipamentoModel.js";
import ValidationService from "./ValidationService.js";

class EquipamentoService {
  static async listarTodos(termo) {
    if (termo) {
      return await EquipamentoModel.buscarPorTermo(termo);
    }

    return await EquipamentoModel.listarTodos();
  }

  static async buscarPorTermo(termo) {
    if (!termo) {
      throw new AppError("Termo de busca não informado", 400);
    }

    const equipamentos = await EquipamentoModel.buscarPorTermo(termo);
    if (equipamentos.length === 0) {
      throw new AppError("Equipamento não encontrado", 404);
    }

    return equipamentos;
  }

  static async cadastrar(data) {
    ValidationService.validarBody(data);
    ValidationService.validarCamposObrigatorios(data, [
      "nome",
      "patrimonio",
      "categoria_id",
      "estado_conservacao",
      "data_aquisicao",
    ], "Campos obrigatórios ausentes");

    ValidationService.validarIdPositivo(data.categoria_id, "Categoria");

    if (data.fornecedor_id !== undefined && data.fornecedor_id !== null) {
      ValidationService.validarIdPositivo(data.fornecedor_id, "Fornecedor");
    }

    ValidationService.validarEnum(
      data.estado_conservacao,
      ["NOVO", "BOM", "REGULAR", "RUIM"],
      "Estado de conservação inválido"
    );

    if (Number.isNaN(new Date(data.data_aquisicao).getTime())) {
      throw new AppError("Data de aquisição inválida", 400);
    }

    const patrimonioDuplicado = await EquipamentoModel.existePatrimonioDuplicado(
      data.patrimonio
    );
    if (patrimonioDuplicado) {
      throw new AppError("Já existe um equipamento cadastrado com este patrimônio", 409);
    }

    if (data.numero_serie) {
      const numeroSerieDuplicado = await EquipamentoModel.existeNumeroSerieDuplicado(
        data.numero_serie
      );
      if (numeroSerieDuplicado) {
        throw new AppError("Número de série já cadastrado", 409);
      }
    }

    const categoriaAtiva = await EquipamentoModel.categoriaAtivaExiste(data.categoria_id);
    if (!categoriaAtiva) {
      throw new AppError("Categoria não encontrada ou inativa", 400);
    }

    if (data.fornecedor_id) {
      const fornecedorAtivo = await EquipamentoModel.fornecedorAtivoExiste(
        data.fornecedor_id
      );
      if (!fornecedorAtivo) {
        throw new AppError("Fornecedor não encontrado ou inativo", 400);
      }
    }

    return await EquipamentoModel.cadastrar({
      nome: data.nome,
      descricao: data.descricao,
      patrimonio: data.patrimonio,
      numero_serie: data.numero_serie,
      categoria_id: data.categoria_id,
      fornecedor_id: data.fornecedor_id || null,
      estado_conservacao: data.estado_conservacao,
      data_aquisicao: data.data_aquisicao,
    });
  }

  static async atualizar(id, data) {
    ValidationService.validarIdPositivo(id);
    ValidationService.validarBody(data, "Corpo da requisição vazio");

    const equipamentoExistente = await EquipamentoModel.buscarPorId(id);
    if (!equipamentoExistente) {
      throw new AppError("Equipamento não encontrado", 404);
    }

    const camposPermitidos = [
      "nome",
      "descricao",
      "patrimonio",
      "numero_serie",
      "categoria_id",
      "fornecedor_id",
      "estado_conservacao",
      "data_aquisicao",
    ];

    const dadosAtualizacao = {};
    for (const campo of camposPermitidos) {
      if (Object.prototype.hasOwnProperty.call(data, campo)) {
        dadosAtualizacao[campo] = data[campo];
      }
    }

    if (Object.keys(dadosAtualizacao).length === 0) {
      throw new AppError("Nenhum campo válido informado para atualização", 400);
    }

    if (dadosAtualizacao.patrimonio) {
      const patrimonioDuplicado = await EquipamentoModel.existePatrimonioDuplicado(
        dadosAtualizacao.patrimonio,
        id
      );
      if (patrimonioDuplicado) {
        throw new AppError("Já existe um equipamento cadastrado com este patrimônio", 409);
      }
    }

    if (dadosAtualizacao.numero_serie) {
      const numeroSerieDuplicado = await EquipamentoModel.existeNumeroSerieDuplicado(
        dadosAtualizacao.numero_serie,
        id
      );
      if (numeroSerieDuplicado) {
        throw new AppError("Número de série já cadastrado", 409);
      }
    }

    if (dadosAtualizacao.categoria_id) {
      ValidationService.validarIdPositivo(dadosAtualizacao.categoria_id, "Categoria");
      const categoriaAtiva = await EquipamentoModel.categoriaAtivaExiste(
        dadosAtualizacao.categoria_id
      );
      if (!categoriaAtiva) {
        throw new AppError("Categoria não encontrada ou inativa", 400);
      }
    }

    if (dadosAtualizacao.fornecedor_id) {
      ValidationService.validarIdPositivo(dadosAtualizacao.fornecedor_id, "Fornecedor");
      const fornecedorAtivo = await EquipamentoModel.fornecedorAtivoExiste(
        dadosAtualizacao.fornecedor_id
      );
      if (!fornecedorAtivo) {
        throw new AppError("Fornecedor não encontrado ou inativo", 400);
      }
    }

    if (dadosAtualizacao.estado_conservacao) {
      ValidationService.validarEnum(
        dadosAtualizacao.estado_conservacao,
        ["NOVO", "BOM", "REGULAR", "RUIM"],
        "Estado de conservação inválido"
      );
    }

    if (
      dadosAtualizacao.data_aquisicao &&
      Number.isNaN(new Date(dadosAtualizacao.data_aquisicao).getTime())
    ) {
      throw new AppError("Data de aquisição inválida", 400);
    }

    return await EquipamentoModel.atualizar(id, dadosAtualizacao);
  }

  static async excluir(id) {
    ValidationService.validarIdPositivo(id);

    const equipamentoExistente = await EquipamentoModel.buscarPorId(id);
    if (!equipamentoExistente) {
      throw new AppError("Equipamento não encontrado", 404);
    }

    const equipamentoEmprestado = await EquipamentoModel.equipamentoEmprestado(id);
    if (equipamentoEmprestado) {
      throw new AppError("Equipamento emprestado não pode ser excluído", 409);
    }

    await EquipamentoModel.excluir(id);
    return { message: "Equipamento excluído com sucesso" };
  }

  static async atualizarStatus(id, status) {
    ValidationService.validarIdPositivo(id);

    if (!status) {
      throw new AppError("Status é obrigatório", 400);
    }

    const statusNormalizado = String(status).toUpperCase();
    ValidationService.validarEnum(
      statusNormalizado,
      ["DISPONIVEL", "EMPRESTADO", "MANUTENCAO", "BAIXADO"],
      "Status inválido"
    );

    const equipamentoAtualizado = await EquipamentoModel.atualizarStatus(
      id,
      statusNormalizado
    );
    if (!equipamentoAtualizado) {
      throw new AppError("Equipamento não encontrado", 404);
    }

    return equipamentoAtualizado;
  }
}

export default EquipamentoService;
