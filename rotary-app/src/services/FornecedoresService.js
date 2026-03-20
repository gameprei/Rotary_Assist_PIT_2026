import ApiService from "./ApiService.js";

class FornecedoresService {

  // =========================
  // FORMATADORES (FRONT)
  // =========================

  formatarDataParaFront(data) {
    if (!data) return "";
    return data.split("T")[0];
  }

  aplicarMascaraCPF(cpf) {
    if (!cpf) return "";
    const limpo = cpf.replace(/\D/g, "");

    if (limpo.length === 11) {
      return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return cpf;
  }

  aplicarMascaraCNPJ(cnpj) {
    if (!cnpj) return "";
    const limpo = cnpj.replace(/\D/g, "");

    if (limpo.length === 14) {
      return limpo.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }

    return cnpj;
  }

  aplicarMascaraTelefone(telefone) {
    if (!telefone) return "";
    const limpo = telefone.replace(/\D/g, "");

    if (limpo.length === 11) {
      return limpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (limpo.length === 10) {
      return limpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return telefone;
  }

  aplicarMascaraCEP(cep) {
    if (!cep) return "";
    const limpo = cep.replace(/\D/g, "");

    if (limpo.length === 8) {
      return limpo.replace(/(\d{5})(\d{3})/, "$1-$2");
    }

    return cep;
  }

  // =========================
  // NORMALIZAÇÃO
  // =========================

  normalizarResposta(resposta) {
    if (Array.isArray(resposta)) return resposta;

    if (resposta && typeof resposta === "object") {
      return (
        resposta.data ||
        resposta.fornecedores ||
        resposta.results ||
        [resposta]
      );
    }

    return [];
  }

  formatarParaFront(f) {
    return {
      id: f.id,
      tipo_pessoa: f.tipo_pessoa || "",
      nome: f.nome || "",
      cpf: this.aplicarMascaraCPF(f.cpf),
      cnpj: this.aplicarMascaraCNPJ(f.cnpj),
      telefone: this.aplicarMascaraTelefone(f.telefone),
      email: f.email || "",
      endereco: f.endereco || "",
      bairro: f.bairro || "",
      cidade: f.cidade || "",
      uf: f.uf || "",
      cep: this.aplicarMascaraCEP(f.cep),
      status: f.status || "",
      data_cadastro: this.formatarDataParaFront(f.data_cadastro)
    };
  }

  formatarParaBack(f) {
    return {
      tipo_pessoa: f.tipo_pessoa || "",
      nome: f.nome || "",
      cpf: f.cpf ? f.cpf.replace(/\D/g, "") : null,
      cnpj: f.cnpj ? f.cnpj.replace(/\D/g, "") : null,
      telefone: f.telefone ? f.telefone.replace(/\D/g, "") : "",
      email: f.email || "",
      endereco: f.endereco || "",
      bairro: f.bairro || "",
      cidade: f.cidade || "",
      uf: f.uf ? f.uf.toUpperCase() : "",
      cep: f.cep ? f.cep.replace(/\D/g, "") : "",
      status: f.status || ""
    };
  }

  // =========================
  // API
  // =========================

  async listarTodos() {
    try {
      const resposta = await ApiService.get("fornecedores");
      const dados = this.normalizarResposta(resposta);

      return dados.map((f) => this.formatarParaFront(f));

    } catch (error) {
      console.error("Erro ao listar fornecedores:", error);
      return [];
    }
  }

  async buscarPorId(id) {
    try {
      const resposta = await ApiService.get(`fornecedores/${id}`);
      return this.formatarParaFront(resposta);

    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
      throw error;
    }
  }

  async excluir(id) {
    try {
      return await ApiService.delete(`fornecedores/${id}`);
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  }

  async filtrar(filtro) {
    try {
      const fornecedores = await this.listarTodos();
      const termo = filtro.toLowerCase();

      return fornecedores.filter((f) =>
        Object.values(f).some(
          (v) =>
            v && v.toString().toLowerCase().includes(termo)
        )
      );

    } catch (error) {
      console.error("Erro ao filtrar fornecedores:", error);
      throw error;
    }
  }

  async cadastrar(fornecedor) {
    try {
      return await ApiService.post(
        "fornecedores",
        this.formatarParaBack(fornecedor)
      );
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      throw error;
    }
  }

  async atualizar(id, fornecedor) {
    try {
      return await ApiService.put(
        `fornecedores/${id}`,
        this.formatarParaBack(fornecedor)
      );
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  }
}

export default new FornecedoresService();