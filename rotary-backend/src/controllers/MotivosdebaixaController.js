import MotivosdebaixaModel from "../models/MotivosdebaixaModel.js";

class MotivosdebaixaController {
    // Listar todas as baixas de equipamentos
    static async listarTodos(req, res) {
        try {
            const motivos = await MotivosdebaixaModel.listarTodos();
            res.json(motivos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cadastrar novo motivo de baixa
    static async cadastrar(req, res) {
        try {
            const motivo = req.body;
            const novoMotivo = await MotivosdebaixaModel.cadastrar(motivo);
            res.status(201).json(novoMotivo);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Excluir motivo de baixa
    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await MotivosdebaixaModel.excluir(id);
            if (sucesso) {
                res.json({ message: "Motivo de baixa excluído com sucesso" });
            } else {
                res.status(404).json({ error: "Motivo de baixa não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   
}

export default MotivosdebaixaController;