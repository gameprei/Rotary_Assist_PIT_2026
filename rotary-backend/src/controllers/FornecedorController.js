import FornecedorService from "../services/FornecedorService.js";
import ApiResponse from "../utils/ApiResponse.js";

class FornecedorController {
    // Listar todos os fornecedores
    static async listarTodos(req, res, next) {
        try {
            const { termo } = req.query;
            const fornecedores = await FornecedorService.listarTodos(termo);
            return res.json(ApiResponse.success(fornecedores, "Fornecedores listados com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Buscar fornecedores por termo (nome || cnpj || cpf || id)
    static async buscarPorTermo(req, res, next) {
        try {
            const { termo } = req.params;
            const fornecedores = await FornecedorService.buscarPorTermo(termo);
            return res.json(ApiResponse.success(fornecedores, "Busca de fornecedores realizada com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Cadastrar novo fornecedor
    static async cadastrar(req, res, next) {
        try {
            const novoFornecedor = await FornecedorService.cadastrar(req.body);
            return res
              .status(201)
              .json(ApiResponse.success(novoFornecedor, "Fornecedor cadastrado com sucesso"));
        } catch (error) {
            next(error);
        }
    }
    
    // Atualizar fornecedor existente
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const fornecedorAtualizado = await FornecedorService.atualizar(id, req.body);
            return res.json(ApiResponse.success(fornecedorAtualizado, "Fornecedor atualizado com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Deletar fornecedor
    static async excluir(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await FornecedorService.excluir(id);
            return res.json(ApiResponse.success(resultado, "Fornecedor excluído com sucesso"));
        } catch (error) {
            next(error);
        }
    }
}
export default FornecedorController;