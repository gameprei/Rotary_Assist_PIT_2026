import express from "express";
import EmprestimoController from "../controllers/EmprestimoController.js";

const router = express.Router();

// Rota para listar todos os empréstimos
router.get("/emprestimos", EmprestimoController.listarTodos);
// Rota para registrar um novo empréstimo
router.post("/emprestimos", EmprestimoController.registrar);

export default router;