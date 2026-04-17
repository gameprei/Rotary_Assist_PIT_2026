import CategoriaService from "../services/CategoriaService.js";
import ApiResponse from "../utils/ApiResponse.js";

class CategoriaController {
    // Listar todas as categorias
    static async listarTodos(req, res, next) {
        try {
            const categorias = await CategoriaService.listarTodos();
            return res.json(ApiResponse.success(categorias, "Categorias listadas com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Buscar categoria por termo (nome || id)
    static async buscarPorTermo(req, res, next) {
        try {
            const { termo } = req.params;
            const categorias = await CategoriaService.buscarPorTermo(termo);
            return res.json(ApiResponse.success(categorias, "Busca de categorias realizada com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Cadastrar nova categoria
    static async cadastrar(req, res, next) {
        try {
            const novaCategoria = await CategoriaService.cadastrar(req.body);
            return res.status(201).json(ApiResponse.success(novaCategoria, "Categoria cadastrada com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Atualizar categoria
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const categoriaAtualizada = await CategoriaService.atualizar(id, req.body);
            return res.json(ApiResponse.success(categoriaAtualizada, "Categoria atualizada com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Excluir categoria
    static async excluir(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await CategoriaService.excluir(id);
            return res.json(ApiResponse.success(resultado, "Categoria excluída com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Atualizar status da categoria
    static async atualizarStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const resultado = await CategoriaService.atualizarStatus(id, status);
            return res.json(ApiResponse.success(resultado, "Status de categoria atualizado com sucesso"));

        } catch (error) {
            next(error);
        }
    }
}

export default CategoriaController;