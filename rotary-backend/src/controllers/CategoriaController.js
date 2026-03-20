import CategoriaModel from "../models/CategoriaModel.js";

class CategoriaController {
    // Listar todas as categorias
    static async listarTodos(req, res) {
        try {
            let categorias;
            categorias = await CategoriaModel.listarTodos();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Buscar categoria por termo (nome || id)
    static async buscarPorTermo(req, res) {
        try {
            const { termo } = req.params;
            const categorias = await CategoriaModel.buscarPorTermo(termo);
            if (categorias.length === 0) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cadastrar nova categoria
    static async cadastrar(req, res) {
        try {
            const { nome, tipo, descricao, status } = req.body;
            if (!nome || !tipo || !descricao) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }

            if (status && !["ATIVO", "INATIVO"].includes(status)) {
                return res.status(400).json({ message: "Status inválido" });
            }

            const novaCategoria = await CategoriaModel.cadastrar({ nome, tipo, descricao, status });
            res.status(201).json(novaCategoria);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Atualizar categoria
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, status } = req.body;
            if (!nome || !descricao) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }

            if (status && !["ATIVO", "INATIVO"].includes(status)) {
                return res.status(400).json({ message: "Status inválido" });
            }

            const categoriaAtualizada = await CategoriaModel.atualizar(id, { nome, descricao, status });
            res.json(categoriaAtualizada);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Excluir categoria
    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const resultado = await CategoriaModel.excluir(id);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Atualizar status da categoria
    static async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Status é obrigatório" });
            }

            if (!["ATIVO", "INATIVO"].includes(status)) {
                return res.status(400).json({ message: "Status inválido" });
            }

            const resultado = await CategoriaModel.atualizarStatus(id, status);

            res.json({
                message: "Status da categoria atualizado com sucesso",
                categoria: resultado
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CategoriaController;