import express from "express";
import FornecedorController from "./../controllers/FornecedorController.js";

const router = express.Router();

// Rota para listar todos os fornecedores
router.get("/fornecedores", FornecedorController.listarTodos);
// Rota para buscar fornecedores por termo (nome || cnpj)
router.get("/fornecedores/:termo", FornecedorController.buscarPorTermo);
// Rota para cadastrar novo fornecedor
router.post("/fornecedores", FornecedorController.cadastrar);
// Rota para atualizar fornecedor 
router.put("/fornecedores/:id", FornecedorController.atualizar);
// Rota para excluir fornecedor
router.delete("/fornecedores/:id", FornecedorController.excluir);

export default router;