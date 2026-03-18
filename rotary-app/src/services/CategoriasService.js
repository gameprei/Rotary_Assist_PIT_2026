import ApiService from "./ApiService.js";

class CategoriasService {
  async listarTodos() {
    try {
      const resposta = await ApiService.get("categorias");
      return resposta.data || resposta;
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      return [];
    }
  }
}

export default new CategoriasService();