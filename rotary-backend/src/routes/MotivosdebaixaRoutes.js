import express from "express";
import MotivosdebaixaController from "../controllers/MotivosdebaixaController.js";

const router = express.Router();

// Rota para listar todas as baixas de equipamentos
router.get("/motivosdebaixa", MotivosdebaixaController.listarTodos);
// Rota para cadastrar um novo motivo de baixa
router.post("/motivosdebaixa", MotivosdebaixaController.cadastrar);
// Rota para excluir um motivo de baixa
router.delete("/motivosdebaixa/:id", MotivosdebaixaController.excluir);

export default router;