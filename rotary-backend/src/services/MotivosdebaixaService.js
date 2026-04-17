import AppError from "../utils/AppError.js";
import MotivosdebaixaModel from "../models/MotivosdebaixaModel.js";
import ValidationService from "./ValidationService.js";

class MotivosdebaixaService {
  static async listarTodos() {
    return await MotivosdebaixaModel.listarTodos();
  }

  static async cadastrar(data) {
    ValidationService.validarBody(data);
    ValidationService.validarCamposObrigatorios(data, ["nome"]);

    if (!String(data.nome).trim()) {
      throw new AppError("Nome do motivo de baixa é obrigatório", 400);
    }

    const status = data.status ? String(data.status).toUpperCase() : "ATIVO";
    ValidationService.validarEnum(status, ["ATIVO", "INATIVO"], "Status inválido");

    const nomeExistente = await MotivosdebaixaModel.buscarPorNome(data.nome);
    if (nomeExistente) {
      throw new AppError("Já existe motivo de baixa com este nome", 409);
    }

    return await MotivosdebaixaModel.cadastrar({
      nome: data.nome,
      status,
    });
  }

  static async excluir(id) {
    ValidationService.validarIdPositivo(id);

    const motivoExistente = await MotivosdebaixaModel.buscarPorId(id);
    if (!motivoExistente) {
      throw new AppError("Motivo de baixa não encontrado", 404);
    }

    const motivoEmUso = await MotivosdebaixaModel.motivoEmUso(id);
    if (motivoEmUso) {
      throw new AppError("Motivo de baixa não pode ser excluído pois está em uso", 409);
    }

    await MotivosdebaixaModel.excluir(id);
    return { message: "Motivo de baixa excluído com sucesso" };
  }
}

export default MotivosdebaixaService;
