import express from "express";
import CategoriaController from "../controllers/CategoriaController.js";

const router = express.Router();

// Rota para listar todas as categorias
router.get("/categorias", CategoriaController.listarTodos);
// Rota para buscar categoria por termo (nome || id)
router.get("/categorias/:termo", CategoriaController.buscarPorTermo);
// Rota para cadastrar uma nova categoria
router.post("/categorias", CategoriaController.cadastrar);
// Rota para atualizar uma categoria existente
router.put("/categorias/:id", CategoriaController.atualizar);
// Rota para deletar uma categoria
router.delete("/categorias/:id", CategoriaController.excluir);
// Rota para atualizar status da categoria
router.patch("/categorias/:id/status", CategoriaController.atualizarStatus);


export default router;