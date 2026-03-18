import ApiService from "./ApiService.js";

class EquipamentosService {

  // =========================
  // HELPERS
  // =========================

  normalizarCampo(obj, campo) {
    return obj[campo] || obj[campo.toUpperCase()] || "";
  }

  limparString(valor) {
    return valor ? valor.toString().trim() : "";
  }

  formatarDataParaFront(data) {
    if (!data) return "";
    return data.split("T")[0]; 
  }

  formatarDataParaBack(data) {
    if (!data) return "";

    // Já está em ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }

    // Converte dd/mm/yyyy → yyyy-mm-dd
    const partes = data.split("/");
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    return data;
  }

  // =========================
  // NORMALIZAÇÃO
  // =========================

  formatarParaFront(e) {
  return {
    id: this.normalizarCampo(e, "id"),
    nome: this.normalizarCampo(e, "nome"),
    descricao: this.normalizarCampo(e, "descricao"),
    categoria: this.normalizarCampo(e, "categoria"),
    categoria_id: this.normalizarCampo(e, "categoria_id"),
    fornecedor: this.normalizarCampo(e, "fornecedor"),
    fornecedor_id: this.normalizarCampo(e, "fornecedor_id"),
    patrimonio: this.normalizarCampo(e, "patrimonio"),
    numero_serie: this.normalizarCampo(e, "numero_serie"),
    tipo: this.normalizarCampo(e, "tipo"),
    estado_conservacao: this.normalizarCampo(e, "estado_conservacao"),
    status: this.normalizarCampo(e, "status"),
    data_aquisicao: this.formatarDataParaFront(
      this.normalizarCampo(e, "data_aquisicao")
    ),
    created_at: this.normalizarCampo(e, "created_at"),
    updated_at: this.normalizarCampo(e, "updated_at"),
  };
}

  formatarParaBack(e) {
  return {
    id: this.limparString(e.id),
    nome: this.limparString(e.nome),
    patrimonio: this.limparString(e.patrimonio),
    tipo: this.limparString(e.tipo),
    numero_serie: this.limparString(e.numero_serie), // NOVO
    categoria_id: this.limparString(e.categoria_id), // NOVO
    fornecedor_id: this.limparString(e.fornecedor_id), // NOVO
    estado_conservacao: this.limparString(e.estado_conservacao),
    status: this.limparString(e.status), // NOVO
    data_aquisicao: this.formatarDataParaBack(e.data_aquisicao),
    descricao: this.limparString(e.descricao),
  };
}

  normalizarResposta(resposta) {
    if (Array.isArray(resposta)) return resposta;

    if (resposta && typeof resposta === "object") {
      return (
        resposta.data ||
        resposta.equipamentos ||
        resposta.results ||
        [resposta]
      );
    }

    return [];
  }

  // =========================
  // API
  // =========================

  async listarTodos() {
    try {
      const resposta = await ApiService.get("equipamentos");
      const dados = this.normalizarResposta(resposta);

      return dados.map(this.formatarParaFront.bind(this));

    } catch (error) {
      console.error("Erro ao listar equipamentos:", error);
      return [];
    }
  }

  async buscarPorPatrimonio(patrimonio) {
    try {
      const patrimonioLimpo = this.limparString(patrimonio);

      // melhora de performance (evita listar tudo)
      const resposta = await ApiService.get(`equipamentos/${patrimonioLimpo}`);

      return this.formatarParaFront(resposta);

    } catch (error) {
      console.error("Erro ao buscar por patrimônio:", error);
      throw error;
    }
  }

  async excluir(id) {
  try {

    console.log("Excluindo equipamento com ID:", id);

    return await ApiService.delete(`equipamentos/${id}`);

  } catch (error) {
    console.error("Erro ao excluir equipamento:", error);
    throw error;
  }
}

  async filtrar(filtro) {
    try {
      const equipamentos = await this.listarTodos();
      const filtroLower = filtro.toLowerCase();

      return equipamentos.filter((e) =>
        Object.values(e).some(
          (v) => v && v.toString().toLowerCase().includes(filtroLower)
        )
      );

    } catch (error) {
      console.error("Erro ao filtrar equipamentos:", error);
      throw error;
    }
  }

  async cadastrar(equipamento) {
    try {
      const patrimonio = this.limparString(equipamento.patrimonio);

      // mantém regra atual (mas agora mais performático)
      const existente = await this.buscarPorPatrimonio(patrimonio);
      if (existente) {
        throw new Error("Patrimônio já cadastrado no sistema");
      }

      return await ApiService.post(
        "equipamentos",
        this.formatarParaBack(equipamento)
      );

    } catch (error) {
      console.error("Erro ao cadastrar equipamento:", error);
      throw error;
    }
  }

  async atualizar(patrimonio, equipamento) {
    try {
      const patrimonioLimpo = this.limparString(patrimonio);

      return await ApiService.put(
        `equipamentos/${patrimonioLimpo}`,
        this.formatarParaBack(equipamento)
      );

    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error);
      throw error;
    }
  }
}

export default new EquipamentosService();