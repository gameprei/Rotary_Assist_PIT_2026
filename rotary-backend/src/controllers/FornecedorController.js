import FornecedorModel from '../models/FornecedorModel.js';

class FornecedorController {
  // Listar todos os fornecedores
  static async listarTodos(req, res) {
    try {
      const { termo } = req.query;
      let fornecedores;

      if (termo) {
        fornecedores = await FornecedorModel.buscarPorTermo(termo);
      } else {
        fornecedores = await FornecedorModel.listarTodos();
      }

      res.json(fornecedores);
    } catch (error) {
      console.error("Erro ao listar fornecedores:", error);
      res.status(500).json({ message: "Erro ao listar fornecedores" });
    }
  }

    // Buscar fornecedores por termo (nome || cnpj)
    static async buscarPorTermo(req, res) {
      try {
        const { termo } = req.params;
        const fornecedores = await FornecedorModel.buscarPorTermo(termo);
        if (fornecedores.length === 0) {
          return res.status(404).json({ message: "Fornecedor não encontrado" });
        }
        res.json(fornecedores);
      } catch (error) {
        console.error("Erro ao buscar fornecedor:", error);
        res.status(500).json({ message: "Erro ao buscar fornecedor" });
      }
    }
}