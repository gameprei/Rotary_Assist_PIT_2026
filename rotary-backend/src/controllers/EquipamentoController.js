import EquipamentoService from "../services/EquipamentoService.js";
import ApiResponse from "../utils/ApiResponse.js";

class EquipamentoController {

  // Listar todos os equipamentos
  static async listarTodos(req, res, next) {
    try {
      const { termo } = req.query;
      const equipamentos = await EquipamentoService.listarTodos(termo);
      return res.json(ApiResponse.success(equipamentos, "Equipamentos listados com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Buscar equipamento por termo (nome ou patrimônio)
  static async buscarPorTermo(req, res, next) {
    try {
      const { termo } = req.params;
      const equipamentos = await EquipamentoService.buscarPorTermo(termo);
      return res.json(ApiResponse.success(equipamentos, "Busca de equipamentos realizada com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Cadastrar novo equipamento
  static async cadastrar(req, res, next) {
    try {
      const novoEquipamento = await EquipamentoService.cadastrar(req.body);
      return res.status(201).json(
        ApiResponse.success(novoEquipamento, "Equipamento cadastrado com sucesso")
      );
    } catch (error) {
      next(error);
    }
  }

  // Atualizar equipamento
  static async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const equipamentoAtualizado = await EquipamentoService.atualizar(id, req.body);
      return res.status(200).json(
        ApiResponse.success(equipamentoAtualizado, "Equipamento atualizado com sucesso")
      );
    } catch (error) {
      next(error);
    }
  }

  // Excluir equipamento
  static async excluir(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await EquipamentoService.excluir(id);
      return res.json(ApiResponse.success(resultado, "Equipamento excluído com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Atualizar status do equipamento
  static async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const equipamentoAtualizado = await EquipamentoService.atualizarStatus(id, status);
      return res.json(
        ApiResponse.success(equipamentoAtualizado, "Status do equipamento atualizado com sucesso")
      );
    } catch (error) {
      next(error);
    }
  }
}

export default EquipamentoController;