import ApiService from "./ApiService.js";

class FornecedoresService {
  async listarTodos() {
    try {
      const resposta = await ApiService.get("fornecedores");
      return resposta.data || resposta;
    } catch (error) {
      console.error("Erro ao listar fornecedores:", error);
      return [];
    }
  }
}

export default new FornecedoresService();