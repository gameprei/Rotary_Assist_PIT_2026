import MotivosdebaixaService from "../services/MotivosdebaixaService.js";
import ApiResponse from "../utils/ApiResponse.js";

class MotivosdebaixaController {
    // Listar todas as baixas de equipamentos
    static async listarTodos(req, res, next) {
        try {
            const motivos = await MotivosdebaixaService.listarTodos();
            return res.json(ApiResponse.success(motivos, "Motivos de baixa listados com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Cadastrar novo motivo de baixa
    static async cadastrar(req, res, next) {
        try {
            const novoMotivo = await MotivosdebaixaService.cadastrar(req.body);
            return res.status(201).json(ApiResponse.success(novoMotivo, "Motivo de baixa cadastrado com sucesso"));
        } catch (error) {
            next(error);
        }
    }

    // Excluir motivo de baixa
    static async excluir(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await MotivosdebaixaService.excluir(id);
            return res.json(ApiResponse.success(resultado, "Motivo de baixa excluído com sucesso"));
        } catch (error) {
            next(error);
        }
    }
}

export default MotivosdebaixaController;