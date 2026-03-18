import ApiService from "./ApiService.js";

class EmprestimosService {
  async listarTodos() {
    try {
      const resposta = await ApiService.get("emprestimos");
      return resposta.data || resposta;
    } catch (error) {
      console.error("Erro ao listar empréstimos:", error);
      return [];
    }
  }
}

export default new EmprestimosService();