import express from "express";
import FornecedorController from "./../controllers/FornecedorController.js";

const router = express.Router();

// Rota para listar todos os fornecedores
router.get("/fornecedores", FornecedorController.listarTodos);
// Rota para buscar fornecedores por termo (nome || cnpj)
router.get("/fornecedores/:termo", FornecedorController.buscarPorTermo);

export default router;