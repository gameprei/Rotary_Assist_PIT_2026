import BeneficiarioService from "../services/BeneficiarioService.js";
import ApiResponse from "../utils/ApiResponse.js";

class BeneficiarioController {
  // Listar todos os beneficiários
  static async listarTodos(req, res, next) {
    try {
      const { termo } = req.query;
      const beneficiarios = await BeneficiarioService.listarTodos(termo);
      return res.json(ApiResponse.success(beneficiarios, "Beneficiários listados com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Buscar beneficiários por termo (nome || cpf || rg)
  static async buscarPorTermo(req, res, next) {
    try {
      const { termo } = req.params;
      const beneficiarios = await BeneficiarioService.buscarPorTermo(termo);
      return res.json(ApiResponse.success(beneficiarios, "Busca de beneficiários realizada com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Cadastrar novo beneficiário 
  static async cadastrar(req, res, next) {
    try {
      const beneficiario = await BeneficiarioService.cadastrar(req.body);
      return res.status(201).json(ApiResponse.success(beneficiario, "Beneficiário cadastrado com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Atualizar beneficiário existente
  static async atualizar(req, res, next) {
    try {
      const { cpfAntigo } = req.params;
      const beneficiarioAtualizado = await BeneficiarioService.atualizar(
        cpfAntigo,
        req.body
      );

      return res.json(ApiResponse.success(beneficiarioAtualizado, "Beneficiário atualizado com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  // Excluir beneficiário
  static async excluir(req, res, next) {
    try {
      const { cpf } = req.params;
      const resultado = await BeneficiarioService.excluir(cpf);
      return res.json(ApiResponse.success(resultado, "Beneficiário excluído com sucesso"));
    } catch (error) {
      next(error);
    }
  }
}

export default BeneficiarioController;