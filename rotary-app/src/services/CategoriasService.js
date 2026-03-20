import ApiService from "./ApiService.js";

class CategoriasService {

  // =========================
  // NORMALIZAÇÃO
  // =========================

  normalizarResposta(resposta) {
    if (Array.isArray(resposta)) return resposta;

    if (resposta && typeof resposta === "object") {
      return (
        resposta.data ||
        resposta.categorias ||
        resposta.results ||
        [resposta]
      );
    }

    return [];
  }

  formatarParaFront(c) {
    return {
      id: c.id,
      nome: c.nome || "",
      tipo: c.tipo || "",
      descricao: c.descricao || "",
      status: c.status || ""
    };
  }

  formatarParaBack(c) {
    return {
      nome: c.nome || "",
      tipo: c.tipo || "",
      descricao: c.descricao || "",
      status: c.status || ""
    };
  }

  // =========================
  // API
  // =========================

  async listarTodos() {
    try {
      const resposta = await ApiService.get("categorias");
      const dados = this.normalizarResposta(resposta);

      return dados.map((c) => this.formatarParaFront(c));

    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      return [];
    }
  }

  async buscarPorId(id) {
    try {
      const resposta = await ApiService.get(`categorias/${id}`);
      return this.formatarParaFront(resposta);

    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      throw error;
    }
  }

  async cadastrar(categoria) {
    try {
      return await ApiService.post(
        "categorias",
        this.formatarParaBack(categoria)
      );
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      throw error;
    }
  }

  async atualizar(id, categoria) {
    try {
      return await ApiService.put(
        `categorias/${id}`,
        this.formatarParaBack(categoria)
      );
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  }

  async excluir(id) {
    try {
      return await ApiService.delete(`categorias/${id}`);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      throw error;
    }
  }

  async filtrar(filtro) {
    try {
      const categorias = await this.listarTodos();
      const termo = filtro.toLowerCase();

      return categorias.filter((c) =>
        Object.values(c).some(
          (v) =>
            v && v.toString().toLowerCase().includes(termo)
        )
      );

    } catch (error) {
      console.error("Erro ao filtrar categorias:", error);
      throw error;
    }
  }
}

export default new CategoriasService();