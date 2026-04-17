import MembroService from "../services/MembroService.js";
import ApiResponse from "../utils/ApiResponse.js";

class MembroController {
  // Listar todos os membros
  static async listarTodos(req, res, next) {
    try {
      const { termo } = req.query;
      const membros = await MembroService.listarTodos(termo);
      return res.json(ApiResponse.success(membros, "Membros listados com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Buscar membros por termo (nome || cpf || cargo)
  static async buscarPorTermo(req, res, next) {
    try {
      const { termo } = req.params;
      const membros = await MembroService.buscarPorTermo(termo);
      return res.json(ApiResponse.success(membros, "Busca de membros realizada com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Cadastrar novo membro
  static async cadastrar(req, res, next) {
    try {
      const novoMembro = await MembroService.cadastrar(req.body);
      return res.status(201).json(ApiResponse.success(novoMembro, "Membro cadastrado com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Atualizar membro existente
  static async atualizar(req, res, next) {
    try {
      const { cpfAntigo } = req.params;
      const membroAtualizado = await MembroService.atualizar(cpfAntigo, req.body);
      return res.json(ApiResponse.success(membroAtualizado, "Membro atualizado com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Excluir membro
  static async excluir(req, res, next) {
    try {
      const { cpf } = req.params;
      const resultado = await MembroService.excluir(cpf);
      return res.json(ApiResponse.success(resultado, "Membro excluído com sucesso"));
    } catch (error) {
      next(error);
    }
  }
}

export default MembroController;