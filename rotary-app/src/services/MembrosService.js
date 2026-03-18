import ApiService from "./ApiService.js";

class MembrosService {

  // =========================
  // HELPERS
  // =========================

  limparNumeros(valor) {
    return valor ? valor.replace(/\D/g, "") : "";
  }

  normalizarCampo(obj, campo) {
    return obj[campo] || obj[campo.toUpperCase()] || "";
  }

  formatarDataParaFront(data) {
    if (!data) return "";
    const dataSemHora = data.split("T")[0];
    return dataSemHora.replace(
      /^(\d{4})-(\d{2})-(\d{2})$/,
      (_, ano, mes, dia) => `${dia}/${mes}/${ano}`
    );
  }

  formatarDataParaBack(data) {
    if (!data) return "";
    return data
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d{2})(\d{4})$/, "$3-$2-$1");
  }

  aplicarMascaraCPF(cpf) {
    const v = this.limparNumeros(cpf);
    return v.length === 11
      ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : cpf || "";
  }

  aplicarMascaraRG(rg) {
    const v = this.limparNumeros(rg);
    return v.length === 9
      ? v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4")
      : rg || "";
  }

  aplicarMascaraTelefone(tel) {
    const v = this.limparNumeros(tel);

    if (v.length === 11) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (v.length === 10) {
      return v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return tel || "";
  }

  aplicarMascaraCEP(cep) {
    const v = this.limparNumeros(cep);
    return v.length === 8
      ? v.replace(/(\d{5})(\d{3})/, "$1-$2")
      : cep || "";
  }

  // =========================
  // NORMALIZAÇÃO
  // =========================

  formatarParaFront(m) {
    return {
      nome: this.normalizarCampo(m, "nome"),
      cpf: this.aplicarMascaraCPF(this.normalizarCampo(m, "cpf")),
      rg: this.aplicarMascaraRG(this.normalizarCampo(m, "rg")),
      email: this.normalizarCampo(m, "email"),
      telefone: this.aplicarMascaraTelefone(this.normalizarCampo(m, "telefone")),
      data_nascimento: this.formatarDataParaFront(this.normalizarCampo(m, "data_nascimento")),
      data_ingresso: this.formatarDataParaFront(this.normalizarCampo(m, "data_ingresso")),
      endereco: this.normalizarCampo(m, "endereco"),
      bairro: this.normalizarCampo(m, "bairro"),
      cidade: this.normalizarCampo(m, "cidade"),
      uf: this.normalizarCampo(m, "uf"),
      cep: this.aplicarMascaraCEP(this.normalizarCampo(m, "cep")),
      cargo: this.normalizarCampo(m, "cargo"),
      profissao: this.normalizarCampo(m, "profissao"),
      empresa: this.normalizarCampo(m, "empresa"),
    };
  }

  formatarParaBack(m) {
    return {
      nome: m.nome || "",
      cpf: this.limparNumeros(m.cpf),
      rg: this.limparNumeros(m.rg),
      email: m.email || "",
      telefone: this.limparNumeros(m.telefone),
      data_nascimento: this.formatarDataParaBack(m.data_nascimento),
      data_ingresso: this.formatarDataParaBack(m.data_ingresso),
      endereco: m.endereco || "",
      bairro: m.bairro || "",
      cidade: m.cidade || "",
      uf: m.uf ? m.uf.toUpperCase() : "",
      cep: this.limparNumeros(m.cep),
      cargo: m.cargo || "",
      profissao: m.profissao || "",
      empresa: m.empresa || "",
    };
  }

  // =========================
  // API
  // =========================

  async listarTodos() {
    try {
      const resposta = await ApiService.get("membros");

      const dados = Array.isArray(resposta)
        ? resposta
        : resposta?.data || resposta?.membros || resposta?.results || [resposta];

      return dados.map(this.formatarParaFront.bind(this));

    } catch (error) {
      console.error("Erro ao listar membros:", error);
      return [];
    }
  }

  async buscarPorCPF(cpf) {
    try {
      const cpfLimpo = this.limparNumeros(cpf);

      const resposta = await ApiService.get(`membros/${cpfLimpo}`);

      return this.formatarParaFront(resposta);

    } catch (error) {
      console.error("Erro ao buscar por CPF:", error);
      throw error;
    }
  }

  async excluir(cpf) {
    try {
      const cpfLimpo = this.limparNumeros(cpf);
      return await ApiService.delete(`membros/${cpfLimpo}`);
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
      throw error;
    }
  }

  async filtrar(filtro) {
    try {
      const membros = await this.listarTodos();
      const filtroLower = filtro.toLowerCase();

      return membros.filter((m) =>
        Object.values(m).some(
          (v) => v && v.toString().toLowerCase().includes(filtroLower)
        )
      );

    } catch (error) {
      console.error("Erro ao filtrar membros:", error);
      throw error;
    }
  }

  async cadastrar(membro) {
    try {
      const cpfLimpo = this.limparNumeros(membro.cpf);

      return await ApiService.post(
        "membros",
        this.formatarParaBack(membro)
      );

    } catch (error) {
      console.error("Erro ao cadastrar membro:", error);
      throw error;
    }
  }

  async atualizar(cpf, membro) {
    try {
      const cpfLimpo = this.limparNumeros(cpf);

      return await ApiService.put(
        `membros/${cpfLimpo}`,
        this.formatarParaBack(membro)
      );

    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
      throw error;
    }
  }
}

export default new MembrosService();